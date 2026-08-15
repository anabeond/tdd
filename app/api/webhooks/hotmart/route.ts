import { NextRequest, NextResponse } from 'next/server'
import { BrevoClient } from '@getbrevo/brevo'

const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY! })
const BREVO_BUYER_LIST_ID = Number(process.env.BREVO_BUYER_LIST_ID)

// https://developers.hotmart.com/docs/en/2.0.0/webhook/purchase-webhook/
const ENROLLMENT_EVENTS = new Set(['PURCHASE_APPROVED', 'PURCHASE_COMPLETE'])

type HotmartPayload = {
  event?: string
  data?: {
    buyer?: { email?: string; name?: string; first_name?: string; last_name?: string }
    product?: { name?: string }
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

  // Ignore everything except a confirmed purchase — cancellations/refunds/etc. are no-ops for now.
  if (!payload.event || !ENROLLMENT_EVENTS.has(payload.event)) {
    return NextResponse.json({ received: true }, { status: 200 })
  }

  const buyer = payload.data?.buyer
  const email = buyer?.email?.trim().toLowerCase()
  if (!email) {
    return NextResponse.json({ received: true }, { status: 200 })
  }

  const firstName = buyer?.first_name || buyer?.name?.split(' ')[0] || ''
  const lastName = buyer?.last_name || ''
  const productName = payload.data?.product?.name

  try {
    await brevo.contacts.createContact({
      email,
      attributes: {
        FIRSTNAME: firstName,
        LASTNAME: lastName,
        ...(productName ? { LAST_PRODUCT_PURCHASED: productName } : {}),
      },
      listIds: [BREVO_BUYER_LIST_ID],
      updateEnabled: true,
    })
  } catch (err: unknown) {
    const status = (err as { statusCode?: number })?.statusCode
    if (status !== 409) {
      console.error('[webhook/hotmart] Brevo error:', err)
      return NextResponse.json({ error: 'Brevo error' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
