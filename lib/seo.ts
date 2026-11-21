import type { Metadata } from 'next'

export const SITE = 'https://cf-llc.github.io'
export const SITE_NAME = 'CF LLC'
export const SITE_DESCRIPTION =
  'Mobile-friendly websites for small businesses anywhere in the US. Starter Site $499 setup + $39/mo. Get a free homepage mockup.'
export const OG_IMAGE = `${SITE}/logo.png`

/** Other CF LLC public sites. No street address. */
export const CF_LLC_SITES: { href: string; label: string }[] = [
  { href: 'https://spockshop.com', label: "Spock's Resale Shop" },
  { href: 'https://satoshispath.netlify.app', label: "Satoshi's Path" },
  { href: 'https://saasnation.site', label: 'SaaS Nation' },
]

export function pageSeo(path: string, title: string, description: string): Metadata {
  const url = !path || path === '/' ? SITE : `${SITE}${path.startsWith('/') ? path : `/${path}`}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', siteName: SITE_NAME, images: [{ url: OG_IMAGE }] },
    twitter: { card: 'summary', title, description, images: [OG_IMAGE] },
  }
}

export function siteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE}/#organization`,
        'name': 'Cooper Featherstone LLC',
        'alternateName': 'CF LLC',
        'url': SITE,
        'email': 'cooperfeatherstonellc@gmail.com',
        'sameAs': [
          'https://spockshop.com',
          'https://satoshispath.netlify.app',
          'https://saasnation.site',
        ],
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${SITE}/#localbusiness`,
        'name': 'CF LLC',
        'url': SITE,
        'email': 'cooperfeatherstonellc@gmail.com',
        'description': SITE_DESCRIPTION,
        'areaServed': { '@type': 'Country', 'name': 'United States' },
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Bentonville',
          'addressRegion': 'AR',
          'addressCountry': 'US',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        'name': SITE_NAME,
        'url': SITE,
        'description': SITE_DESCRIPTION,
        'publisher': { '@id': `${SITE}/#organization` },
        'inLanguage': 'en-US',
      },
    ],
  }
}

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
