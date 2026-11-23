/**
 * CF LLC website inquiry intake.
 * Emails cooperfeatherstonellc@gmail.com via Resend (saasnation.site) with
 * Reply-To set to the submitter, and mirrors a copy to Formspree for storage.
 * Recipient is hardcoded and never taken from the request.
 */

const CONTACT_EMAIL = 'cooperfeatherstonellc@gmail.com'
const FROM = 'CF LLC <inquiries@saasnation.site>'
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mqegdjgj'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function allowedOrigin(origin) {
  if (!origin) return ''
  try {
    const { hostname, protocol } = new URL(origin)
    const http = protocol === 'http:' || protocol === 'https:'
    if (!http) return ''
    if (hostname === 'cf-llc.github.io') return origin
    if (hostname === 'cooperfeatherstone.netlify.app') return origin
    if (hostname.endsWith('--cooperfeatherstone.netlify.app')) return origin
    if (hostname === 'localhost' || hostname === '127.0.0.1') return origin
    return ''
  } catch {
    return ''
  }
}

function corsHeaders(origin) {
  const allow = allowedOrigin(origin)
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    Vary: 'Origin',
  }
  if (allow) headers['Access-Control-Allow-Origin'] = allow
  return headers
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function cleanText(value, max) {
  return String(value || '')
    .replace(/[\r\n\t]+/g, ' ')
    .trim()
    .slice(0, max)
}

function fieldLines(fields) {
  const entries = Object.entries(fields || {}).filter(([, v]) => v != null && String(v).trim() !== '')
  return entries.map(([key, value]) => [key, String(value).trim().slice(0, 2000)])
}

exports.handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin || ''
  const headers = { ...corsHeaders(origin), 'Content-Type': 'application/json' }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: allowedOrigin(origin) ? 204 : 403, headers, body: '' }
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  }
  if (!allowedOrigin(origin) && event.headers.origin) {
    return { statusCode: 403, headers, body: JSON.stringify({ error: 'Forbidden' }) }
  }

  let payload
  try {
    payload = JSON.parse(event.body || '{}')
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) }
  }

  if (String(payload.honeypot || '').trim()) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) }
  }

  const email = String(payload.email || '').trim()
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'A valid email is required' }) }
  }

  const form = cleanText(payload.form || 'website-inquiry', 80)
  const subject = cleanText(payload.subject || `New website inquiry (${form})`, 160)
  const fields = fieldLines(payload.fields)

  const textLines = [
    'New inquiry from the CF LLC website.',
    '',
    `Form: ${form}`,
    `Reply to: ${email}`,
    '',
    ...fields.map(([k, v]) => `${k}: ${v}`),
    '',
    'Hit Reply to answer this person directly.',
  ]
  const text = textLines.join('\n')
  const htmlFields = fields
    .map(([k, v]) => `<p><strong>${escapeHtml(k)}:</strong><br>${escapeHtml(v).replace(/\n/g, '<br>')}</p>`)
    .join('')
  const html = `
    <p>New inquiry from the CF LLC website.</p>
    <p><strong>Form:</strong> ${escapeHtml(form)}<br>
    <strong>Reply to:</strong> ${escapeHtml(email)}</p>
    ${htmlFields}
    <p>Hit Reply to answer this person directly.</p>
  `.trim()

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Notification service is not configured' }) }
  }

  const idempotencyKey = `cf-llc-inquiry/${Date.now()}/${email.slice(0, 40)}`
  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({
      from: FROM,
      to: [CONTACT_EMAIL],
      reply_to: email,
      subject,
      text,
      html,
    }),
  })

  if (!resendRes.ok) {
    const detail = await resendRes.text().catch(() => '')
    console.error('Resend failed', resendRes.status, detail.slice(0, 500))
    return { statusCode: 502, headers, body: JSON.stringify({ error: 'Could not send notification' }) }
  }

  // Stored copy in Formspree (best-effort; notification already sent).
  try {
    const stored = { email, form, _subject: subject, _replyto: email }
    for (const [k, v] of fields) stored[k] = v
    await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(stored),
    })
  } catch (err) {
    console.error('Formspree store failed', err)
  }

  return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) }
}
