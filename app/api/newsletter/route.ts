import { NextRequest, NextResponse } from 'next/server'
import { BrevoClient } from '@getbrevo/brevo'
import { supabaseServer } from '@/lib/supabase-server'

const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY! })
const BREVO_LIST_ID = Number(process.env.BREVO_NEWSLETTER_LIST_ID)

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, email } = body as { name?: string; email?: string }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 422 })
  }
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'Nombre requerido' }, { status: 422 })
  }

  const sanitizedEmail = email.trim().toLowerCase()
  const sanitizedName = name.trim()

  // Check for existing subscriber in Supabase
  const { data: existing } = await supabaseServer
    .from('newsletter_subscribers')
    .select('id')
    .eq('email', sanitizedEmail)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'Ya estás suscripto.' }, { status: 409 })
  }

  // Add to Brevo
  let brevoContactId: string | undefined
  try {
    const response = await brevo.contacts.createContact({
      email: sanitizedEmail,
      attributes: { FIRSTNAME: sanitizedName },
      listIds: [BREVO_LIST_ID],
      updateEnabled: true,
    })
    brevoContactId = String((response as { id?: number }).id ?? '')
  } catch (err: unknown) {
    // If contact already exists in Brevo, continue — still save to Supabase
    const status = (err as { statusCode?: number })?.statusCode
    if (status !== 409) {
      console.error('[newsletter] Brevo error:', err)
      return NextResponse.json({ error: 'Error al suscribir. Intentá de nuevo.' }, { status: 500 })
    }
  }

  // Save to Supabase
  const { error: dbError } = await supabaseServer.from('newsletter_subscribers').insert({
    email: sanitizedEmail,
    name: sanitizedName,
    brevo_contact_id: brevoContactId ?? null,
    status: 'active',
  })

  if (dbError) {
    console.error('[newsletter] Supabase insert error:', dbError)
    return NextResponse.json({ error: 'Error interno. Intentá de nuevo.' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
