import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { upsertContact, addContactToList, removeContactFromList, sendWelcomeEmail } from '@/lib/brevo'

const BREVO_BUYER_LIST_ID = Number(process.env.BREVO_BUYER_LIST_ID)

// https://developers.hotmart.com/docs/en/2.0.0/webhook/purchase-webhook/
const ENROLL_EVENTS = new Set(['PURCHASE_APPROVED', 'PURCHASE_COMPLETE'])

// Refund/chargeback/etc. end an enrollment. PURCHASE_PROTEST (disputed, unresolved) and
// PURCHASE_DELAYED/PURCHASE_BILLET_PRINTED (payment not yet completed) are intentionally
// left out — no enrollment exists yet or the outcome isn't final, so they're no-ops.
const UNENROLL_STATUS: Record<string, 'canceled' | 'refunded' | 'chargeback' | 'expired'> = {
  PURCHASE_CANCELED: 'canceled',
  PURCHASE_REFUNDED: 'refunded',
  PURCHASE_CHARGEBACK: 'chargeback',
  PURCHASE_EXPIRED: 'expired',
}

type HotmartPayload = {
  event?: string
  data?: {
    product?: { id?: number; ucode?: string; name?: string }
    buyer?: { ucode?: string; email?: string; name?: string; first_name?: string; last_name?: string }
    purchase?: { transaction?: string; status?: string; approved_date?: number }
  }
}

export async function POST(req: NextRequest) {
  // Hotmart sends a fixed per-account token in this header — compare, don't trust the body.
  const hottok = req.headers.get('x-hotmart-hottok')
  if (!hottok || hottok !== process.env.HOTMART_HOTTOK) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let payload: HotmartPayload
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const event = payload.event
  const isEnroll = !!event && ENROLL_EVENTS.has(event)
  const unenrollStatus = event ? UNENROLL_STATUS[event] : undefined

  if (!isEnroll && !unenrollStatus) {
    return NextResponse.json({ received: true }, { status: 200 })
  }

  const buyer = payload.data?.buyer
  const email = buyer?.email?.trim().toLowerCase()
  if (!email) {
    return NextResponse.json({ received: true }, { status: 200 })
  }

  const firstName = buyer?.first_name || buyer?.name?.split(' ')[0] || ''
  const lastName = buyer?.last_name || ''
  // Note: bundle purchases list additional products under data.product.content.products[] —
  // only the top-level data.product is handled for now.
  const product = payload.data?.product
  const purchase = payload.data?.purchase

  // Brevo sync is best-effort — a Brevo outage or bad credentials must never block
  // enrolling the student in Supabase, which is the source of truth for course access.
  try {
    await upsertContact({
      email,
      firstName,
      lastName,
      listIds: [BREVO_BUYER_LIST_ID],
      attributes: product?.name ? { LAST_PRODUCT_PURCHASED: product.name } : undefined,
    })
  } catch (err) {
    console.error('[webhook/hotmart] Brevo upsertContact error:', err)
  }

  try {
    const { data: matchedProduct } = product?.ucode
      ? await supabaseServer
          .from('products')
          .select('id, brevo_list_id, slug')
          .eq('hotmart_ucode', product.ucode)
          .maybeSingle()
      : { data: null }

    if (!matchedProduct) {
      console.warn('[webhook/hotmart] no product mapped for ucode', product?.ucode, product?.name)
      return NextResponse.json({ received: true }, { status: 200 })
    }

    const { data: student, error: studentError } = await supabaseServer
      .from('students')
      .upsert(
        {
          email,
          name: buyer?.name,
          first_name: firstName || null,
          last_name: lastName || null,
          hotmart_buyer_ucode: buyer?.ucode ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      )
      .select('id, welcome_email_sent')
      .single()

    if (studentError || !student) {
      console.error('[webhook/hotmart] Supabase student upsert error:', studentError)
      return NextResponse.json({ received: true }, { status: 200 })
    }

    // Welcome email fires once per student, on their first-ever active enrollment —
    // never blocks enrollment, and only flips the flag after a successful send so a
    // transient Brevo failure can retry on a future purchase webhook.
    if (isEnroll && !student.welcome_email_sent && matchedProduct.slug === 'fundamentals-ux-ui') {
      try {
        await sendWelcomeEmail({ email, name: buyer?.name })
        await supabaseServer.from('students').update({ welcome_email_sent: true }).eq('id', student.id)
      } catch (err) {
        console.error('[webhook/hotmart] welcome email error:', err)
      }
    }

    const status = isEnroll ? 'active' : unenrollStatus!

    const { error: enrollmentError } = await supabaseServer.from('enrollments').upsert(
      {
        student_id: student.id,
        product_id: matchedProduct.id,
        status,
        hotmart_transaction: purchase?.transaction ?? null,
        hotmart_ucode: product?.ucode ?? null,
        purchased_at: purchase?.approved_date ? new Date(purchase.approved_date).toISOString() : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'student_id,product_id' }
    )

    if (enrollmentError) {
      console.error('[webhook/hotmart] Supabase enrollment upsert error:', enrollmentError)
    }

    if (matchedProduct.brevo_list_id) {
      try {
        if (isEnroll) {
          await addContactToList(email, matchedProduct.brevo_list_id)
        } else {
          // Un-enroll stops program-specific emails but keeps the buyer in the general list.
          await removeContactFromList(email, matchedProduct.brevo_list_id)
        }
      } catch (err) {
        console.error('[webhook/hotmart] Brevo list sync error:', err)
      }
    }
  } catch (err) {
    console.error('[webhook/hotmart] error:', err)
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
