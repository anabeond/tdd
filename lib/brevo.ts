import { BrevoClient } from '@getbrevo/brevo'

export const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY! })

function isNonFatalBrevoError(err: unknown, ...codes: number[]) {
  const status = (err as { statusCode?: number })?.statusCode
  return status !== undefined && codes.includes(status)
}

export async function upsertContact(params: {
  email: string
  firstName?: string
  lastName?: string
  listIds: number[]
  attributes?: Record<string, string>
}) {
  try {
    await brevo.contacts.createContact({
      email: params.email,
      attributes: {
        ...(params.firstName ? { FIRSTNAME: params.firstName } : {}),
        ...(params.lastName ? { LASTNAME: params.lastName } : {}),
        ...params.attributes,
      },
      listIds: params.listIds,
      updateEnabled: true,
    })
  } catch (err) {
    if (!isNonFatalBrevoError(err, 409)) throw err
  }
}

export async function addContactToList(email: string, listId: number) {
  try {
    await brevo.contacts.addContactToList({ listId, body: { emails: [email] } })
  } catch (err) {
    if (!isNonFatalBrevoError(err, 404, 400)) throw err
  }
}

export async function removeContactFromList(email: string, listId: number) {
  try {
    await brevo.contacts.removeContactFromList({ listId, body: { emails: [email] } })
  } catch (err) {
    if (!isNonFatalBrevoError(err, 404, 400)) throw err
  }
}

export async function createList(name: string, folderId: number) {
  return brevo.contacts.createList({ name, folderId })
}

export async function sendWelcomeEmail(params: { email: string; name?: string }) {
  const senderEmail = process.env.BREVO_SENDER_EMAIL
  const senderName = process.env.BREVO_SENDER_NAME || 'The Design Dojo'
  if (!senderEmail) throw new Error('BREVO_SENDER_EMAIL is not configured')

  const colorsUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/colors`
  const firstName = params.name?.split(' ')[0] || 'diseñador/a'

  await brevo.transactionalEmails.sendTransacEmail({
    sender: { email: senderEmail, name: senderName },
    to: [{ email: params.email, name: params.name }],
    subject: '¡Bienvenido/a al Dojo! 🎉',
    htmlContent: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h1 style="font-size: 24px;">¡Hola, ${firstName}!</h1>
        <p style="font-size: 16px; line-height: 1.5;">
          Ya sos parte de The Design Dojo. Antes de arrancar, tenemos algo para vos:
          elegí tu color favorito y sumate al mural que estamos construyendo entre todos
          los estudiantes del Dojo.
        </p>
        <p style="margin: 32px 0;">
          <a href="${colorsUrl}" style="background:#DD3208; color:#fff; padding:12px 24px; text-decoration:none; font-weight:bold;">
            Elegir mi color →
          </a>
        </p>
        <p style="font-size: 14px; color: #666;">Nos vemos en el Dojo.</p>
      </div>
    `,
  })
}
