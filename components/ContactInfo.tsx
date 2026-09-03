'use client'

import { FormEvent, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Github, Instagram, Mail, Send, Twitter, Video } from 'lucide-react'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mqegdjgj'

const contactInfo = [
  { icon: Mail, label: 'Email', url: 'mailto:cooperfeatherstonellc@gmail.com' },
  { icon: Github, label: 'GitHub', url: 'https://github.com/cf-llc' },
  { icon: Instagram, label: 'Instagram', url: 'https://www.instagram.com/helpfulgrowthtips' },
  { icon: Twitter, label: 'X (Twitter)', url: 'https://x.com/TipsFromACEO' },
  { icon: Video, label: 'TikTok', url: 'https://tiktok.com/@helpfulgrowthtips' },
]

const initialForm = {
  name: '',
  company: '',
  email: '',
  proposal: '',
  website: ''
}

export default function ContactInfo() {
  const [formData, setFormData] = useState(initialForm)
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const mailtoHref = useMemo(() => {
    const subjectSource = formData.company || formData.name || 'Website inquiry'
    const subject = `Project inquiry from ${subjectSource}`
    const body = [
      'Name: ' + (formData.name || 'Not provided'),
      'Company: ' + (formData.company || 'Not provided'),
      'Email: ' + (formData.email || 'Not provided'),
      '',
      'Proposal:',
      formData.proposal || 'Please share your proposal here.'
    ].join('\n')

    return `mailto:cooperfeatherstonellc@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }, [formData.company, formData.email, formData.name, formData.proposal])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitState === 'submitting') return
    setSubmitState('submitting')
    if (formData.website.trim()) {
      setSubmitState('success')
      setFormData(initialForm)
      return
    }
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          email: formData.email,
          proposal: formData.proposal,
          website: formData.website
        })
      })
      if (!response.ok) throw new Error('Formspree submission failed')
      setSubmitState('success')
      setFormData(initialForm)
    } catch {
      setSubmitState('error')
    }
  }

  return (
    <section className="glass overflow-hidden rounded-[2rem] p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="space-y-6">
          <div>
            <p className="kicker">Contact</p>
            <h2 className="display-title mt-3 text-3xl text-white sm:text-5xl">Want to work together or need help on a project?</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
              Email is the fastest path. GitHub and socials stay public if you want to look first.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {contactInfo.map((item) => (
              <a
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-4 text-white"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <span className="font-medium">{item.label}</span>
                </span>
                <ArrowRight className="h-4 w-4 text-white/60" />
              </a>
            ))}
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm text-white/70">
            <p className="font-semibold uppercase tracking-[0.22em] text-white/55">Direct email</p>
            <p className="mt-2 text-base text-white">cooperfeatherstonellc@gmail.com</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[1.75rem] border border-white/10 bg-black/20 p-5 sm:p-6">
          <div className="mb-6">
            <p className="kicker">Project intake</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Start the conversation</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="hidden" aria-hidden="true">
              <span>Leave this field blank</span>
              <input type="text" tabIndex={-1} autoComplete="off" value={formData.website} onChange={(event) => setFormData(current => ({ ...current, website: event.target.value }))} className="hidden" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/70">Name</span>
              <input type="text" value={formData.name} onChange={(event) => setFormData(current => ({ ...current, name: event.target.value }))} placeholder="Your name" required className="w-full rounded-2xl border border-white/12 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 focus:outline-none" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/70">Company</span>
              <input type="text" value={formData.company} onChange={(event) => setFormData(current => ({ ...current, company: event.target.value }))} placeholder="Company or team" className="w-full rounded-2xl border border-white/12 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 focus:outline-none" />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-white/70">Email</span>
              <input type="email" value={formData.email} onChange={(event) => setFormData(current => ({ ...current, email: event.target.value }))} placeholder="you@company.com" required className="w-full rounded-2xl border border-white/12 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 focus:outline-none" />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-white/70">What do you need?</span>
              <textarea value={formData.proposal} onChange={(event) => setFormData(current => ({ ...current, proposal: event.target.value }))} placeholder="What are you trying to build, improve, or fix?" rows={7} required className="w-full rounded-[1.5rem] border border-white/12 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 focus:outline-none" />
            </label>
          </div>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-sm leading-6 text-white/55">Include enough detail to estimate scope. I reply with a clear next step.</p>
            <motion.button type="submit" disabled={submitState === 'submitting'} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-950 disabled:opacity-60">
              <Send className="h-4 w-4" />
              {submitState === 'submitting' ? 'Sending...' : 'Send'}
            </motion.button>
          </div>
          {submitState === 'success' && (
            <p className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">Message received. I&apos;ll follow up shortly.</p>
          )}
          {submitState === 'error' && (
            <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-200/10 px-4 py-3 text-sm text-amber-100">
              <p>Couldn&apos;t send this right now. Email directly instead.</p>
              <a href={mailtoHref} className="mt-2 inline-flex items-center font-semibold underline">Email cooperfeatherstonellc@gmail.com</a>
            </div>
          )}
        </form>
      </div>
    </section>
  )
}
