import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

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

  const sanitizedEmail = email.trim().toLowerCase()
  const sanitizedName = name.trim()

  const { data: product } = await supabaseServer
    .from('products')
    .select('id')
    .eq('slug', productSlug)
    .eq('active', true)
    .maybeSingle()

  if (!product) {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
  }

  await supabaseServer.from('orders').insert({
    email: sanitizedEmail,
    name: sanitizedName,
    product_id: product.id,
    payment_method: 'paypal',
    status: 'pending',
  })

  return NextResponse.json({ ok: true })
}
