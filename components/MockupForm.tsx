'use client'

import { FormEvent, useState } from 'react'

const TO = 'cooperfeatherstonellc@gmail.com'

/*
 * No-signup method: builds a prefilled mailto: and opens the visitor's mail app.
 * Optional alternative (NOT active): FormSubmit. Change the form to
 *   <form action="https://formsubmit.co/cooperfeatherstonellc@gmail.com" method="POST">
 * and drop onSubmit. The first submission sends a one-time confirmation email
 * that Cooper must click before FormSubmit forwards anything.
 */
export default function MockupForm() {
  const [sent, setSent] = useState(false)

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const d = new FormData(e.currentTarget)
    const biz = String(d.get('business') || '').trim()
    const site = String(d.get('site') || '').trim() || '(none yet)'
    const email = String(d.get('email') || '').trim()
    const subject = `Free homepage mockup request: ${biz}`
    const body = `Hi Cooper,\n\nI'd like a free homepage mockup.\n\nBusiness name: ${biz}\nCurrent site: ${site}\nMy email: ${email}\n\nThanks!`
    window.location.href = `mailto:${TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  const field = 'mt-2 w-full rounded-md border border-white/30 bg-[#111114] px-4 py-3 text-base text-white placeholder:text-white/50 focus:border-white focus:outline-none focus:ring-2 focus:ring-[#4aa8b8]'

  return (
    <form onSubmit={onSubmit} className="grid gap-5" aria-describedby="form-note">
      <div>
        <label htmlFor="business" className="font-semibold">Business name</label>
        <input id="business" name="business" required autoComplete="organization" className={field} />
      </div>
      <div>
        <label htmlFor="site" className="font-semibold">Current website <span className="font-normal text-white/70">(optional)</span></label>
        <input id="site" name="site" type="url" inputMode="url" placeholder="https://" autoComplete="url" className={field} />
      </div>
      <div>
        <label htmlFor="email" className="font-semibold">Your email</label>
        <input id="email" name="email" type="email" required autoComplete="email" className={field} />
      </div>
      <button type="submit" className="rounded-md bg-[#eceae4] px-6 py-3 font-semibold text-[#070708] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#4aa8b8] focus:ring-offset-2 focus:ring-offset-[#070708]">
        Request my free mockup
      </button>
      <p id="form-note" className="text-sm text-white/75" aria-live="polite">
        {sent
          ? 'Your email app should open with the request filled in. Just hit send.'
          : <>This opens your email app with the details filled in. Or email <a className="underline" href={`mailto:${TO}`}>{TO}</a> directly.</>}
      </p>
    </form>
  )
}
