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

    if (submitState === 'submitting') {
      return
    }

    setSubmitState('submitting')

    if (formData.website.trim()) {
      setSubmitState('success')
      setFormData(initialForm)
      return
    }

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          email: formData.email,
          proposal: formData.proposal,
          website: formData.website
        })
      })

      if (!response.ok) {
        throw new Error('Formspree submission failed')
      }

      setSubmitState('success')
      setFormData(initialForm)
    } catch {
      setSubmitState('error')
    }
  }

  return (
    <section className="section-card overflow-hidden rounded-[2rem] p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="space-y-6"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-200/60">Apply or reach out</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Tell us what you want to build.</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-sky-100/72 sm:text-lg">
              Share your goals, timeline, and scope. We review each proposal and respond with clear next steps.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {contactInfo.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-between rounded-[1.25rem] border border-sky-200/10 bg-sky-50/5 px-4 py-4 text-sky-50 shadow-lg shadow-slate-950/10"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-300/12 text-sky-200">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <span className="font-medium">{item.label}</span>
                </span>
                <ArrowRight className="h-4 w-4 text-sky-300" />
              </motion.a>
            ))}
          </div>

          <div className="rounded-[1.5rem] border border-sky-200/10 bg-sky-50/5 p-5 text-sm text-sky-100/72">
            <p className="font-semibold uppercase tracking-[0.22em] text-sky-200/70">Direct email</p>
            <p className="mt-2 text-base text-white">cooperfeatherstonellc@gmail.com</p>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
          onSubmit={handleSubmit}
          className="glass-panel rounded-[1.75rem] p-5 sm:p-6"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-200/60">Project intake</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Start your proposal</h3>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="hidden" aria-hidden="true">
              <span>Leave this field blank</span>
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={formData.website}
                onChange={(event) => setFormData(current => ({ ...current, website: event.target.value }))}
                className="hidden"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-sky-100/76">Name</span>
              <input
                type="text"
                value={formData.name}
                onChange={(event) => setFormData(current => ({ ...current, name: event.target.value }))}
                placeholder="Your name"
                required
                className="w-full rounded-2xl border border-sky-200/12 bg-slate-950/25 px-4 py-3 text-white placeholder:text-sky-100/35 focus:border-sky-300/45 focus:outline-none focus:ring-2 focus:ring-sky-300/20"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-sky-100/76">Company</span>
              <input
                type="text"
                value={formData.company}
                onChange={(event) => setFormData(current => ({ ...current, company: event.target.value }))}
                placeholder="Company or team"
                className="w-full rounded-2xl border border-sky-200/12 bg-slate-950/25 px-4 py-3 text-white placeholder:text-sky-100/35 focus:border-sky-300/45 focus:outline-none focus:ring-2 focus:ring-sky-300/20"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-sky-100/76">Email</span>
              <input
                type="email"
                value={formData.email}
                onChange={(event) => setFormData(current => ({ ...current, email: event.target.value }))}
                placeholder="you@company.com"
                required
                className="w-full rounded-2xl border border-sky-200/12 bg-slate-950/25 px-4 py-3 text-white placeholder:text-sky-100/35 focus:border-sky-300/45 focus:outline-none focus:ring-2 focus:ring-sky-300/20"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-sky-100/76">Proposal</span>
              <textarea
                value={formData.proposal}
                onChange={(event) => setFormData(current => ({ ...current, proposal: event.target.value }))}
                placeholder="What are you trying to build, improve, or fix?"
                rows={7}
                required
                className="w-full rounded-[1.5rem] border border-sky-200/12 bg-slate-950/25 px-4 py-3 text-white placeholder:text-sky-100/35 focus:border-sky-300/45 focus:outline-none focus:ring-2 focus:ring-sky-300/20"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-sm leading-6 text-sky-100/62">
              Include enough detail for us to estimate scope and recommend the right build path.
            </p>
            <motion.button
              type="submit"
              disabled={submitState === 'submitting'}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-300 via-sky-400 to-blue-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-950 shadow-lg shadow-sky-900/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {submitState === 'submitting' ? 'Sending...' : 'Send proposal'}
            </motion.button>
          </div>

          {submitState === 'success' && (
            <p className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">
              Proposal received. We&apos;ll follow up with next steps shortly.
            </p>
          )}

          {submitState === 'error' && (
            <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-200/10 px-4 py-3 text-sm text-amber-100">
              <p>We couldn&apos;t send this right now. Please reach out directly by email.</p>
              <a href={mailtoHref} className="mt-2 inline-flex items-center font-semibold text-amber-50 underline underline-offset-2">
                Email CF LLC directly
              </a>
            </div>
          )}
        </motion.form>
      </div>
    </section>
  )
}