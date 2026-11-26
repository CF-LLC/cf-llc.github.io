'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { CONTACT_EMAIL, submitInquiry } from '@/lib/form'

export type Interest = 'mockup' | 'care-plan'
export const CARE_PLAN_LABEL = 'Website Care Plan ($99/month)'

function mailtoFor(biz: string, site: string, email: string, interest: Interest) {
  const care = interest === 'care-plan'
  const subject = care ? `Website Care Plan inquiry: ${biz || 'your business'}` : `Free homepage mockup request: ${biz || 'your business'}`
  const body = [
    'Hi Cooper,',
    '',
    care ? "I'm interested in the Website Care Plan ($99/month)." : "I'd like a free homepage mockup.",
    '',
    `Business name: ${biz || '(not provided)'}`,
    `Current site: ${site || '(none yet)'}`,
    `My email: ${email || '(not provided)'}`,
    '',
    'Thanks!',
  ].join('\n')
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export default function MockupForm({ defaultInterest = 'mockup' }: { defaultInterest?: Interest }) {
  const [interest, setInterest] = useState<Interest>(defaultInterest)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [draft, setDraft] = useState({ business: '', site: '', email: '' })
  const mailtoHref = useMemo(() => mailtoFor(draft.business, draft.site, draft.email, interest), [draft, interest])

  // Links like /?interest=care-plan#mockup preselect the care plan.
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get('interest')
    if (v === 'care-plan' || v === 'mockup') setInterest(v)
  }, [])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'submitting') return
    const form = e.currentTarget
    const d = new FormData(form)
    const business = String(d.get('business') || '').trim()
    const site = String(d.get('site') || '').trim()
    const email = String(d.get('email') || '').trim()
    const honeypot = String(d.get('company_website') || '').trim()
    setDraft({ business, site, email })
    const chosen = (String(d.get('interest') || interest) === 'care-plan' ? 'care-plan' : 'mockup') as Interest
    setStatus('submitting')
    if (honeypot) {
      setStatus('success')
      form.reset()
      return
    }
    try {
      await submitInquiry({
        email,
        form: chosen === 'care-plan' ? 'care-plan' : 'free-mockup',
        subject: chosen === 'care-plan' ? `Website Care Plan inquiry: ${business}` : `Free homepage mockup request: ${business}`,
        fields: {
          interest: chosen === 'care-plan' ? CARE_PLAN_LABEL : 'Free homepage mockup',
          business,
          site: site || '(none yet)',
        },
      })
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  const field = 'mt-2 w-full rounded-md border border-white/30 bg-[#111114] px-4 py-3 text-base text-white placeholder:text-white/50 focus:border-white focus:outline-none focus:ring-2 focus:ring-[#4aa8b8]'

  return (
    <form onSubmit={onSubmit} className="relative grid gap-5" aria-describedby="form-note">
      <div>
        <label htmlFor="interest" className="font-semibold">I&apos;m interested in</label>
        <select id="interest" name="interest" value={interest} onChange={(e) => setInterest(e.target.value as Interest)} className={field}>
          <option value="mockup">A free homepage mockup</option>
          <option value="care-plan">{CARE_PLAN_LABEL}</option>
        </select>
      </div>
      <div>
        <label htmlFor="business" className="font-semibold">Business name</label>
        <input id="business" name="business" required autoComplete="organization" className={field} onChange={(e) => setDraft((c) => ({ ...c, business: e.target.value }))} />
      </div>
      <div>
        <label htmlFor="site" className="font-semibold">Current website <span className="font-normal text-white/70">{interest === 'care-plan' ? '(the site you want cared for)' : '(optional)'}</span></label>
        <input id="site" name="site" type="url" inputMode="url" placeholder="https://" autoComplete="url" className={field} onChange={(e) => setDraft((c) => ({ ...c, site: e.target.value }))} />
      </div>
      <div>
        <label htmlFor="email" className="font-semibold">Your email</label>
        <input id="email" name="email" type="email" required autoComplete="email" className={field} onChange={(e) => setDraft((c) => ({ ...c, email: e.target.value }))} />
      </div>
      <div aria-hidden="true" className="absolute -left-[9999px] h-1 w-1 overflow-hidden">
        <label htmlFor="company_website">Company website</label>
        <input id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" disabled={status === 'submitting'} className="rounded-md bg-[#eceae4] px-6 py-3 font-semibold text-[#070708] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#4aa8b8] focus:ring-offset-2 focus:ring-offset-[#070708] disabled:opacity-60">
        {status === 'submitting' ? 'Sending…' : interest === 'care-plan' ? 'Ask about the Care Plan' : 'Request my free mockup'}
      </button>
      <div id="form-note" className="text-sm text-white/75" aria-live="polite">
        {status === 'success' && (
          <p role="status">Thanks — your {interest === 'care-plan' ? 'care plan inquiry' : 'mockup request'} was sent. I&apos;ll email you back at the address you entered.</p>
        )}
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
  )
}
