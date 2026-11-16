import type { MetadataRoute } from 'next'
import { caseStudies } from '@/data/caseStudies'

const SITE = 'https://cf-llc.github.io'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/nwa', '/bentonville-websites', '/case-studies', '/ecosystem']
  const studies = caseStudies.map((c) => `/case-studies/${c.slug}`)
  return [...pages, ...studies].map((path) => ({ url: `${SITE}${path}`, changeFrequency: 'monthly' as const }))
}
