import { packages, type SitePackage } from '@/data/packages'

export const QUOTE_PATH = '/quote'

export const BUSINESS_OPTIONS = [
  { id: 'restaurant', label: 'Restaurant or cafe' },
  { id: 'shop', label: 'Shop or retail' },
  { id: 'service', label: 'Service business' },
  { id: 'personal', label: 'Personal brand or portfolio' },
  { id: 'has-site', label: 'I already have a website' },
  { id: 'other', label: 'Something else' },
] as const

export const PAGES_OPTIONS = [
  { id: '1-3', label: '1–3 pages' },
  { id: 'up-to-8', label: 'Up to 8 pages (booking, menu, or gallery)' },
  { id: 'not-sure', label: "I'm not sure yet" },
  { id: 'already-have', label: "I already have a site; I don't need new pages" },
] as const

export const TIMELINE_OPTIONS = [
  { id: 'asap', label: 'As soon as possible' },
  { id: 'can-wait', label: 'I can wait' },
  { id: 'exploring', label: 'Just exploring' },
] as const

export const CARE_OPTIONS = [
  { id: 'hosting', label: 'Yes, include hosting and updates' },
  { id: 'care-only', label: 'I already have a site and just need care (updates and uptime checks)' },
  { id: 'not-sure', label: 'Not sure yet' },
] as const

export type BusinessId = (typeof BUSINESS_OPTIONS)[number]['id']
export type PagesId = (typeof PAGES_OPTIONS)[number]['id']
export type TimelineId = (typeof TIMELINE_OPTIONS)[number]['id']
export type CareId = (typeof CARE_OPTIONS)[number]['id']

export type QuoteAnswers = {
  business: BusinessId
  pages: PagesId
  timeline: TimelineId
  care: CareId
}

export type QuoteRecommendation = {
  pkg: SitePackage
  reason: string
}

const byName = (name: string) => {
  const pkg = packages.find((p) => p.name === name)
  if (!pkg) throw new Error(`Missing package: ${name}`)
  return pkg
}

/**
 * Recommend a live package from the published price sheet only.
 * Reasons are limited to facts already on the packages list / FAQ:
 * Starter is 1–3 pages; Pro is up to 8 pages and lists booking, menu or gallery;
 * Site Care is for an existing site.
 */
export function recommendQuote(a: QuoteAnswers): QuoteRecommendation {
  const starter = byName('Starter Site')
  const pro = byName('Pro Site')
  const care = byName('Site Care')

  const alreadyHasSite = a.business === 'has-site' || a.pages === 'already-have' || a.care === 'care-only'
  const wantsNewBuild = a.pages === '1-3' || a.pages === 'up-to-8'
  if (alreadyHasSite && !wantsNewBuild) {
    return {
      pkg: care,
      reason:
        'You already have a site and do not need new pages, so Site Care fits: updates, uptime checks, and a monthly report for an existing site.',
    }
  }

  if (a.pages === 'up-to-8' || a.business === 'restaurant') {
    return {
      pkg: pro,
      reason:
        a.business === 'restaurant' && a.pages !== 'up-to-8'
          ? 'A restaurant or cafe often needs a menu or booking page. Pro Site includes up to 8 pages and lists booking, menu or gallery, plus basic SEO.'
          : 'You need more than a 1–3 page site. Pro Site includes up to 8 pages, booking, menu or gallery, basic SEO, and 2 revision rounds.',
    }
  }

  return {
    pkg: starter,
    reason:
      'Starter Site covers a 1–3 page mobile site with a contact form, and hosting and updates are included in the monthly fee. A Starter Site is typically live within about a week of approving a mockup, as long as I have your text and photos.',
  }
}

export function optionLabel<T extends { id: string; label: string }>(options: readonly T[], id: string): string {
  return options.find((o) => o.id === id)?.label ?? id
}
