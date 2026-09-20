import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { isColorKey, type ColorKey } from '@/lib/colors'
import { getColorTally } from '@/lib/color-votes'
import { upsertContact } from '@/lib/brevo'

const BREVO_COLORS_LIST_ID = Number(process.env.BREVO_COLORS_LIST_ID)

// Lets the mural keep refreshing itself while someone leaves the page open.
export async function GET() {
  return NextResponse.json({ ok: true, ...(await getColorTally()) })
}

export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; color?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido.' }, { status: 400 })
  }

  const name = body.name?.trim()
  const email = body.email?.trim().toLowerCase()
  const color = body.color

  if (!name || !email || !color || !isColorKey(color)) {
    return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Email inválido.' }, { status: 422 })
  }

  let yourColor: ColorKey = color
  let alreadySubmitted = false

  // One vote per email — an email that already picked keeps its original color.
  const { data: existing } = await supabaseServer
    .from('color_votes')
    .select('color')
    .eq('email', email)
    .maybeSingle()

  if (existing) {
    alreadySubmitted = true
    yourColor = existing.color as ColorKey
  } else {
    const { error: insertError } = await supabaseServer
      .from('color_votes')
      .insert({ name, email, color })

    if (insertError && insertError.code !== '23505') {
      console.error('[colors] Supabase insert error:', insertError)
      return NextResponse.json({ error: 'Error al guardar. Intentá de nuevo.' }, { status: 500 })
    }
    if (insertError?.code === '23505') {
      // Race: another request just inserted first — fetch what actually got saved.
      const { data: raced } = await supabaseServer
        .from('color_votes')
        .select('color')
        .eq('email', email)
        .maybeSingle()
      if (raced) {
        alreadySubmitted = true
        yourColor = raced.color as ColorKey
      }
    }
  }

  // Brevo is best-effort; Supabase is the source of truth. Runs for repeat submissions too
  // so a previously failed sync heals.
  if (BREVO_COLORS_LIST_ID) {
    try {
      await upsertContact({ email, firstName: name, listIds: [BREVO_COLORS_LIST_ID] })
    } catch (err) {
      console.error('[colors] Brevo error:', err)
    }
  }

  return NextResponse.json({
    ok: true,
    yourColor,
    alreadySubmitted,
    ...(await getColorTally()),
  })
}
