'use client'

import { FormEvent, useMemo, useState } from 'react'
import { CONTACT_EMAIL, FORMSPREE_ENDPOINT } from '@/lib/form'
import {
  BUSINESS_OPTIONS,
  CARE_OPTIONS,
  PAGES_OPTIONS,
  TIMELINE_OPTIONS,
  optionLabel,
  recommendQuote,
  type BusinessId,
  type CareId,
  type PagesId,
  type QuoteAnswers,
  type TimelineId,
} from '@/lib/quote'

const field =
  'mt-2 w-full rounded-md border border-white/30 bg-[#111114] px-4 py-3 text-base text-white placeholder:text-white/50 focus:border-white focus:outline-none focus:ring-2 focus:ring-[#4aa8b8]'
const choice =
  'flex min-h-[48px] cursor-pointer items-center gap-3 rounded-md border border-white/20 bg-white/[0.03] px-4 py-3 text-left hover:border-white/50 has-[:checked]:border-[#4aa8b8] has-[:checked]:bg-[#4aa8b8]/15'

const STEPS = [
  { key: 'business' as const, title: 'What kind of business is it?', options: BUSINESS_OPTIONS },
  { key: 'pages' as const, title: 'About how many pages do you need?', options: PAGES_OPTIONS },
  { key: 'timeline' as const, title: 'When do you want to launch?', options: TIMELINE_OPTIONS },
  { key: 'care' as const, title: 'Do you want ongoing hosting and updates?', options: CARE_OPTIONS },
]

function mailtoFor(answers: QuoteAnswers, recName: string, business: string, email: string, notes: string) {
  const subject = `Quote request: ${recName} for ${business || 'a small business'}`
  const body = [
    'Hi Cooper,',
    '',
    `I'd like a quote. The quiz recommended ${recName}.`,
    '',
    `Business name: ${business || '(not provided)'}`,
    `My email: ${email || '(not provided)'}`,
    `Business type: ${optionLabel(BUSINESS_OPTIONS, answers.business)}`,
    `Pages needed: ${optionLabel(PAGES_OPTIONS, answers.pages)}`,
    `Timeline: ${optionLabel(TIMELINE_OPTIONS, answers.timeline)}`,
    `Ongoing care: ${optionLabel(CARE_OPTIONS, answers.care)}`,
    notes ? `Notes: ${notes}` : '',
    '',
    'Thanks!',
  ]
    .filter((l) => l !== undefined)
    .join('\n')
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export default function QuoteQuiz() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<QuoteAnswers>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [draft, setDraft] = useState({ business: '', email: '', notes: '' })

  const complete = Boolean(answers.business && answers.pages && answers.timeline && answers.care)
  const rec = complete ? recommendQuote(answers as QuoteAnswers) : null
  const mailtoHref = useMemo(
    () => (rec && complete ? mailtoFor(answers as QuoteAnswers, rec.pkg.name, draft.business, draft.email, draft.notes) : `mailto:${CONTACT_EMAIL}`),
    [answers, complete, rec, draft],
  )

  function choose(key: (typeof STEPS)[number]['key'], id: string) {
    const next = { ...answers, [key]: id }
    setAnswers(next)
    if (step < STEPS.length - 1) setStep(step + 1)
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'submitting' || !rec || !complete) return
    const form = e.currentTarget
    const d = new FormData(form)
    const business = String(d.get('business') || '').trim()
    const email = String(d.get('email') || '').trim()
    const notes = String(d.get('notes') || '').trim()
    const honeypot = String(d.get('company_website') || '').trim()
    setDraft({ business, email, notes })
    setStatus('submitting')
    if (honeypot) {
      setStatus('success')
      form.reset()
      return
    }
    try {
      const a = answers as QuoteAnswers
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          business,
          email,
          notes: notes || '(none)',
          form: 'quote-quiz',
          recommended: `${rec.pkg.name} (${rec.pkg.price} ${rec.pkg.priceNote})`,
          reason: rec.reason,
          business_type: optionLabel(BUSINESS_OPTIONS, a.business),
          pages_needed: optionLabel(PAGES_OPTIONS, a.pages),
          timeline: optionLabel(TIMELINE_OPTIONS, a.timeline),
          ongoing_care: optionLabel(CARE_OPTIONS, a.care),
          _subject: `Quote request: ${rec.pkg.name} for ${business}`,
          _replyto: email,
        }),
      })
      if (!response.ok) throw new Error('Form submission failed')
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="rounded-lg border border-white/15 bg-[#111114]/80 p-6 sm:p-8">
      <ol className="mb-6 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider text-white/60" aria-label="Quiz progress">
        {STEPS.map((s, i) => (
          <li key={s.key} className={i === step || (complete && i <= 3) ? 'text-[#8fd3de]' : ''}>
            {i + 1}. {i === 0 ? 'Business' : i === 1 ? 'Pages' : i === 2 ? 'Timeline' : 'Care'}
          </li>
        ))}
      </ol>

      {STEPS.map((s, i) => (
        <fieldset key={s.key} className={i === step && !complete ? 'grid gap-3' : 'hidden'}>
          <legend className="mb-3 text-xl font-semibold text-white">{s.title}</legend>
          {s.options.map((o) => (
            <label key={o.id} className={choice}>
              <input
                type="radio"
                name={s.key}
                value={o.id}
                className="accent-[#4aa8b8]"
                checked={answers[s.key] === o.id}
                onChange={() => choose(s.key, o.id as BusinessId & PagesId & TimelineId & CareId)}
              />
              <span>{o.label}</span>
            </label>
          ))}
          {i > 0 ? (
            <button type="button" className="mt-2 justify-self-start text-sm text-white/70 underline" onClick={() => setStep(i - 1)}>
              Back
            </button>
          ) : null}
        </fieldset>
      ))}

      {rec && complete ? (
        <div>
          <p className="kicker">Your match</p>
          <h3 className="mt-2 text-3xl text-white">{rec.pkg.name}</h3>
          <p className="mt-3">
            <span className="text-4xl font-semibold text-white">{rec.pkg.price}</span>{' '}
            <span className="text-white/80">{rec.pkg.priceNote}</span>
          </p>
          <p className="mt-4 leading-7 text-white/80">{rec.reason}</p>
          <p className="mt-3 leading-7 text-white/70">{rec.pkg.blurb}</p>
          <p className="mt-4">
            <a href={rec.pkg.href} className="inline-block rounded-md bg-[#eceae4] px-5 py-3 font-semibold text-[#070708] hover:bg-white">
              Buy {rec.pkg.name}
              <span className="sr-only"> (secure checkout on Stripe)</span>
            </a>
          </p>
          <button type="button" className="mt-4 text-sm text-white/70 underline" onClick={() => { setAnswers({}); setStep(0); setStatus('idle') }}>
            Start over
          </button>

          <form onSubmit={onSubmit} className="relative mt-10 grid gap-5 border-t border-white/15 pt-8" aria-describedby="quote-form-note">
            <h3 className="text-2xl text-white">Send this as a lead</h3>
            <p className="text-sm text-white/75">I&apos;ll email you back at the address you enter. You can also buy the package above if you already know you want it.</p>
            <div>
              <label htmlFor="quote-business" className="font-semibold">Business name</label>
              <input id="quote-business" name="business" required autoComplete="organization" className={field} onChange={(e) => setDraft((c) => ({ ...c, business: e.target.value }))} />
            </div>
            <div>
              <label htmlFor="quote-email" className="font-semibold">Your email</label>
              <input id="quote-email" name="email" type="email" required autoComplete="email" className={field} onChange={(e) => setDraft((c) => ({ ...c, email: e.target.value }))} />
            </div>
            <div>
              <label htmlFor="quote-notes" className="font-semibold">Anything else <span className="font-normal text-white/70">(optional)</span></label>
              <textarea id="quote-notes" name="notes" rows={3} className={field} onChange={(e) => setDraft((c) => ({ ...c, notes: e.target.value }))} />
            </div>
            <div aria-hidden="true" className="absolute -left-[9999px] h-1 w-1 overflow-hidden">
              <label htmlFor="quote_company_website">Company website</label>
              <input id="quote_company_website" name="company_website" tabIndex={-1} autoComplete="off" />
            </div>
            <button type="submit" disabled={status === 'submitting'} className="rounded-md bg-[#eceae4] px-6 py-3 font-semibold text-[#070708] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#4aa8b8] focus:ring-offset-2 focus:ring-offset-[#070708] disabled:opacity-60">
              {status === 'submitting' ? 'Sending…' : 'Send my quote request'}
            </button>
            <div id="quote-form-note" className="text-sm text-white/75" aria-live="polite">
              {status === 'success' && <p role="status">Thanks — your quote request was sent. I&apos;ll email you back at the address you entered.</p>}
              {status === 'error' && (
                <p role="alert">
                  Couldn&apos;t send this right now. Please email me directly:{' '}
                  <a className="underline" href={mailtoHref}>{CONTACT_EMAIL}</a>
                </p>
              )}
              {status !== 'success' && status !== 'error' && (
                <p>
                  The request is sent on this page. You can also email{' '}
                  <a className="underline" href={mailtoHref}>{CONTACT_EMAIL}</a> directly.
                </p>
              )}
            </div>
          </form>
        </div>
      ) : null}
    </div>
  )
}
