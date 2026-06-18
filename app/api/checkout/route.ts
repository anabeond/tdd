import { NextRequest, NextResponse } from 'next/server'
import MercadoPagoConfig, { Preference } from 'mercadopago'
import { supabaseServer } from '@/lib/supabase-server'

const mp = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

const preferenceClient = new Preference(mp)

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { productSlug, email, name } = body as {
    productSlug?: string
    email?: string
    name?: string
  }

  if (!productSlug || !email || !name) {
    return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 422 })
  }
  if (!email.includes('@')) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 422 })
  }

  const sanitizedEmail = email.trim().toLowerCase()
  const sanitizedName = name.trim()

  // Fetch product from Supabase
  const { data: product, error: productError } = await supabaseServer
    .from('products')
    .select('id, title, price, currency, thinkific_course_id')
    .eq('slug', productSlug)
    .eq('active', true)
    .maybeSingle()

  if (productError || !product) {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
  }

  // Create Mercado Pago preference
  let preference: Awaited<ReturnType<typeof preferenceClient.create>>
  try {
    preference = await preferenceClient.create({
      body: {
        items: [
          {
            id: productSlug,
            title: product.title,
            quantity: 1,
            unit_price: Number(product.price),
            currency_id: product.currency,
          },
        ],
        payer: {
          email: sanitizedEmail,
          name: sanitizedName,
        },
        back_urls: {
          success: `${BASE_URL}/checkout/success`,
          failure: `${BASE_URL}/checkout/failure`,
          pending: `${BASE_URL}/checkout/pending`,
        },
        notification_url: `${BASE_URL}/api/webhooks/mercadopago`,
        metadata: {
          product_slug: productSlug,
          buyer_email: sanitizedEmail,
          buyer_name: sanitizedName,
        },
      },
    })
  } catch (err) {
    console.error('[checkout] MercadoPago error:', err)
    return NextResponse.json({ error: 'Error al crear el pago. Intentá de nuevo.' }, { status: 500 })
  }

  return NextResponse.json(
    {
      init_point: preference.init_point,
      preference_id: preference.id,
    },
    { status: 200 }
  )
}
