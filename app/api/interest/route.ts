import { NextRequest, NextResponse } from 'next/server'
import { BrevoClient } from '@getbrevo/brevo'
import { supabaseServer } from '@/lib/supabase-server'

const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY! })
const BREVO_POTENTIALS_LIST_ID = Number(process.env.BREVO_POTENTIALS_LIST_ID)

export async function POST(req: NextRequest) {
  const { name, email, productSlug } = await req.json()

  if (!name || !email || !productSlug) {
    return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 })
  }

  const sanitizedEmail = email.trim().toLowerCase()
  const sanitizedName = name.trim()

  // Look up product title
  const { data: product } = await supabaseServer
    .from('products')
    .select('title')
    .eq('slug', productSlug)
    .single()

  const productTitle = product?.title ?? productSlug

  // Save to Supabase (unique per product+email)
  const { error: dbError } = await supabaseServer
    .from('interest_signups')
    .insert({ name: sanitizedName, email: sanitizedEmail, product_slug: productSlug })

  if (dbError) {
    if (dbError.code === '23505') {
      return NextResponse.json({ error: 'duplicate' }, { status: 409 })
    }
    console.error('[interest] Supabase error:', dbError)
    return NextResponse.json({ error: 'Error al guardar. Intentá de nuevo.' }, { status: 500 })
  }

  // Add to Brevo potentials list, appending to existing INTERESTED_IN if contact already exists
  try {
    let interestedIn = productTitle

    try {
      const existing = await brevo.contacts.getContactInfo(sanitizedEmail) as { attributes?: { INTERESTED_IN?: string } }
      const current = existing?.attributes?.INTERESTED_IN
      if (current && !current.split(',').map((s: string) => s.trim()).includes(productTitle)) {
        interestedIn = `${current}, ${productTitle}`
      } else if (current) {
        interestedIn = current // already listed, no change
      }
    } catch {
      // Contact doesn't exist yet — use productTitle as-is
    }

    await brevo.contacts.createContact({
      email: sanitizedEmail,
      attributes: {
        FIRSTNAME: sanitizedName,
        INTERESTED_IN: interestedIn,
      },
      listIds: [BREVO_POTENTIALS_LIST_ID],
      updateEnabled: true,
    })
  } catch (err: unknown) {
    const status = (err as { statusCode?: number })?.statusCode
    if (status !== 409) {
      console.error('[interest] Brevo error:', err)
      // Don't fail the request — data is already saved in Supabase
    }
  }

  return NextResponse.json({ ok: true })
}
