import { NextRequest, NextResponse } from 'next/server'
import MercadoPagoConfig, { Payment } from 'mercadopago'
import { supabaseServer } from '@/lib/supabase-server'
import { createHmac } from 'crypto'

const mp = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

const paymentClient = new Payment(mp)

/**
 * Validates the Mercado Pago webhook signature.
 * https://www.mercadopago.com.ar/developers/en/docs/your-integrations/notifications/webhooks
 */
function validateSignature(req: NextRequest, rawBody: string): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET
  if (!secret) return false

  const xSignature = req.headers.get('x-signature')
  const xRequestId = req.headers.get('x-request-id')
  const dataId = new URL(req.url).searchParams.get('data.id')

  if (!xSignature || !xRequestId) return false

  // Parse ts and v1 from x-signature header
  const parts = Object.fromEntries(
    xSignature.split(',').map((part) => {
      const [k, v] = part.split('=')
      return [k.trim(), v?.trim()]
    })
  )

  const { ts, v1 } = parts
  if (!ts || !v1) return false

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`
  const expected = createHmac('sha256', secret).update(manifest).digest('hex')

  return expected === v1
}

async function enrollInThinkific(
  email: string,
  name: string,
  thinkificCourseId: string
): Promise<string | null> {
  const subdomain = process.env.THINKIFIC_SUBDOMAIN!
  const apiKey = process.env.THINKIFIC_API_KEY!

  // Find or create user
  const userRes = await fetch(
    `https://api.thinkific.com/api/public/v1/users?query[email]=${encodeURIComponent(email)}`,
    {
      headers: {
        'X-Auth-API-Key': apiKey,
        'X-Auth-Subdomain': subdomain,
        'Content-Type': 'application/json',
      },
    }
  )

  let thinkificUserId: number

  if (userRes.ok) {
    const userData = await userRes.json()
    if (userData.items?.length > 0) {
      thinkificUserId = userData.items[0].id
    } else {
      // Create new user
      const [firstName, ...rest] = name.split(' ')
      const createUserRes = await fetch('https://api.thinkific.com/api/public/v1/users', {
        method: 'POST',
        headers: {
          'X-Auth-API-Key': apiKey,
          'X-Auth-Subdomain': subdomain,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          first_name: firstName,
          last_name: rest.join(' ') || '',
          send_welcome_email: true,
        }),
      })

      if (!createUserRes.ok) {
        console.error('[thinkific] Failed to create user:', await createUserRes.text())
        return null
      }

      const newUser = await createUserRes.json()
      thinkificUserId = newUser.id
    }
  } else {
    console.error('[thinkific] Failed to fetch user:', await userRes.text())
    return null
  }

  // Create enrollment
  const enrollRes = await fetch('https://api.thinkific.com/api/public/v1/enrollments', {
    method: 'POST',
    headers: {
      'X-Auth-API-Key': apiKey,
      'X-Auth-Subdomain': subdomain,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      course_id: Number(thinkificCourseId),
      user_id: thinkificUserId,
    }),
  })

  if (!enrollRes.ok) {
    console.error('[thinkific] Failed to enroll:', await enrollRes.text())
    return null
  }

  const enrollment = await enrollRes.json()
  return String(enrollment.id)
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  // Validate signature
  if (!validateSignature(req, rawBody)) {
    console.warn('[webhook/mp] Invalid signature')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let event: { type?: string; action?: string; data?: { id?: string } }
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Log raw event
  await supabaseServer.from('webhook_logs').insert({
    source: 'mercadopago',
    event_type: event.type ?? event.action ?? 'unknown',
    payload: event,
    status: 'received',
  })

  // Only handle payment events
  if (event.type !== 'payment' || !event.data?.id) {
    return NextResponse.json({ received: true }, { status: 200 })
  }

  const paymentId = String(event.data.id)

  // Idempotency: check if already processed
  const { data: existingOrder } = await supabaseServer
    .from('orders')
    .select('id, status')
    .eq('mercadopago_payment_id', paymentId)
    .maybeSingle()

  if (existingOrder?.status === 'paid') {
    return NextResponse.json({ received: true }, { status: 200 })
  }

  // Fetch payment from MP to verify (never trust webhook payload alone)
  let payment: Awaited<ReturnType<typeof paymentClient.get>>
  try {
    payment = await paymentClient.get({ id: paymentId })
  } catch (err) {
    console.error('[webhook/mp] Failed to fetch payment:', err)
    return NextResponse.json({ error: 'Failed to fetch payment' }, { status: 500 })
  }

  if (payment.status !== 'approved') {
    return NextResponse.json({ received: true }, { status: 200 })
  }

  const buyerEmail = (payment.metadata as { buyer_email?: string })?.buyer_email ?? payment.payer?.email ?? ''
  const buyerName = (payment.metadata as { buyer_name?: string })?.buyer_name ?? ''
  const productSlug = (payment.metadata as { product_slug?: string })?.product_slug ?? ''

  // Look up product by slug
  const { data: product } = await supabaseServer
    .from('products')
    .select('id, thinkific_course_id')
    .eq('slug', productSlug)
    .maybeSingle()

  // Create the order now that payment is confirmed
  const { data: newOrder } = await supabaseServer
    .from('orders')
    .insert({
      email: buyerEmail,
      name: buyerName,
      product_id: product?.id ?? null,
      mercadopago_preference_id: (payment as { preference_id?: string }).preference_id ?? null,
      mercadopago_payment_id: paymentId,
      payment_method: 'mercadopago',
      status: 'paid',
      paid_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  // Enroll in Thinkific if product has a course ID
  if (newOrder && product?.thinkific_course_id && buyerEmail && buyerName) {
    const enrollmentId = await enrollInThinkific(buyerEmail, buyerName, product.thinkific_course_id)
    if (enrollmentId) {
      await supabaseServer
        .from('orders')
        .update({ thinkific_enrollment_id: enrollmentId })
        .eq('id', newOrder.id)
    }
  }

  // Update webhook log to processed
  await supabaseServer
    .from('webhook_logs')
    .update({ status: 'processed' })
    .contains('payload', { data: { id: paymentId } })
    .eq('source', 'mercadopago')

  return NextResponse.json({ received: true }, { status: 200 })
}
