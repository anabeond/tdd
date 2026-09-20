import { NextRequest, NextResponse } from 'next/server'
import { BrevoClient } from '@getbrevo/brevo'
import { supabaseServer } from '@/lib/supabase-server'

const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY! })
const BREVO_POTENTIALS_LIST_ID = Number(process.env.BREVO_POTENTIALS_LIST_ID)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  let body: { name?: unknown; email?: unknown; productSlug?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, email, productSlug } = body
  if (typeof name !== 'string' || typeof email !== 'string' || typeof productSlug !== 'string' || !name.trim() || !email.trim() || !productSlug) {
    return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 })
  }

  const sanitizedEmail = email.trim().toLowerCase()
  const sanitizedName = name.trim()

  if (!EMAIL_RE.test(sanitizedEmail)) {
    return NextResponse.json({ error: 'Email inválido.' }, { status: 422 })
  }

  const { data: product } = await supabaseServer
    .from('products')
    .select('slug, interest_brevo_list_id')
    .eq('slug', productSlug)
    .eq('status', 'coming_soon')
    .maybeSingle()

  if (!product) {
    return NextResponse.json({ error: 'Producto no encontrado.' }, { status: 404 })
  }

  // Supabase is the source of truth (unique per product + email)
  const { error: dbError } = await supabaseServer
    .from('interest_signups')
    .insert({ name: sanitizedName, email: sanitizedEmail, product_slug: productSlug })

  const duplicate = dbError?.code === '23505'
  if (dbError && !duplicate) {
    console.error('[interest] Supabase error:', dbError)
    return NextResponse.json({ error: 'Error al guardar. Intentá de nuevo.' }, { status: 500 })
  }

  // Brevo is best-effort: one global "interesados" list plus one list per product.
  // Also runs on duplicates so a previously failed Brevo sync heals on retry.
  const listIds = [BREVO_POTENTIALS_LIST_ID, product.interest_brevo_list_id].filter(
    (id): id is number => typeof id === 'number' && Number.isFinite(id)
  )
  if (!product.interest_brevo_list_id) {
    console.error(`[interest] No interest_brevo_list_id for product "${productSlug}" — only added to the global list`)
  }

  try {
    await brevo.contacts.createContact({
      email: sanitizedEmail,
      attributes: { FIRSTNAME: sanitizedName },
      listIds,
      updateEnabled: true,
    })
  } catch (err: unknown) {
    const status = (err as { statusCode?: number })?.statusCode
    if (status !== 409) console.error('[interest] Brevo error:', err)
  }

  if (duplicate) return NextResponse.json({ error: 'duplicate' }, { status: 409 })
  return NextResponse.json({ ok: true })
}
