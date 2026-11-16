import type { Metadata } from 'next'
import NwaLanding, { nwaMeta } from '@/components/NwaLanding'

// Alias of /nwa for local-search URLs. Canonical stays on /nwa.
export const metadata: Metadata = {
  title: nwaMeta.title,
  description: nwaMeta.description,
  alternates: { canonical: nwaMeta.canonical },
  openGraph: { title: nwaMeta.title, description: nwaMeta.description, url: nwaMeta.canonical },
  robots: { index: true, follow: true },
}

export default function BentonvilleWebsitesPage() {
  return <NwaLanding />
}
