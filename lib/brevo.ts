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
    // FDUX - Welcome Email template in Brevo (Transactional > Templates, id 1).
  // Subject, sender and body are all managed there, not here.
  await brevo.transactionalEmails.sendTransacEmail({
        templateId: 1,
        to: [{ email: params.email, name: params.name }],
  })
}
