/** Shared intake config. Notifications go to the CF LLC business inbox. */
export const CONTACT_EMAIL = 'cooperfeatherstonellc@gmail.com'
export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mqegdjgj'
/** Netlify function that emails Cooper via Resend (lands in Primary, not Updates). */
export const INQUIRY_API = 'https://cooperfeatherstone.netlify.app/.netlify/functions/inquiry'

export type InquiryPayload = {
  email: string
  subject: string
  form?: string
  fields: Record<string, string | undefined>
  honeypot?: string
}

const jsonHeaders = { 'Content-Type': 'application/json', Accept: 'application/json' }

/** Send an inquiry to the notification API, falling back to Formspree if the API is down. */
export async function submitInquiry(payload: InquiryPayload): Promise<void> {
  const body = JSON.stringify(payload)
  try {
    const response = await fetch(INQUIRY_API, { method: 'POST', headers: jsonHeaders, body })
    if (response.ok) return
  } catch {
    // API unreachable; use Formspree so the lead is still stored and emailed.
  }

  const fallback = await fetch(FORMSPREE_ENDPOINT, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({
      ...payload.fields,
      email: payload.email,
      form: payload.form,
      _subject: payload.subject,
      _replyto: payload.email,
    }),
  })
  if (!fallback.ok) throw new Error('Form submission failed')
}
