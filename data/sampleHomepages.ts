// Sample homepage mockups for the public gallery.
// Business names, towns, and copy are invented. These are not client sites
// and do not use real OpenClaw lead data or contact details.
import { packages, type SitePackage } from './packages'

export type SampleHomepage = {
  slug: string
  name: string
  trade: string
  family: string
  familyLabel: string
  blurb: string
  packageName: 'Starter Site' | 'Pro Site'
  whyPackage: string
  image: string
  imageAlt: string
}

export const sampleHomepages: SampleHomepage[] = [
  {
    slug: 'millcross-plumbing',
    name: 'Millcross Plumbing',
    trade: 'Plumbing',
    family: 'dispatch',
    familyLabel: 'Dispatch',
    blurb: 'A service-call homepage for a made-up local plumber: work-order voice, a short service list, and a clear way to get in touch.',
    packageName: 'Starter Site',
    whyPackage: 'A 1–3 page mobile site with a contact form is the right fit for a straightforward service business.',
    image: '/sample-homepages/millcross-plumbing.webp',
    imageAlt: 'Sample homepage mockup for a fictional plumber named Millcross Plumbing, with a work-order style layout.',
  },
  {
    slug: 'pinewharf-lock',
    name: 'Pinewharf Lock & Key',
    trade: 'Locksmith',
    family: 'keyway',
    familyLabel: 'Keyway',
    blurb: 'A locksmith-style homepage for a made-up mobile lock shop, with a key motif and residential, auto, and commercial groupings.',
    packageName: 'Starter Site',
    whyPackage: 'Starter Site covers a compact service list and a contact form, which is what this kind of page needs.',
    image: '/sample-homepages/pinewharf-lock.webp',
    imageAlt: 'Sample homepage mockup for a fictional locksmith named Pinewharf Lock & Key, with a brass-and-pine key design.',
  },
  {
    slug: 'clearwharf-windows',
    name: 'Clearwharf Window Care',
    trade: 'Window washing',
    family: 'pane',
    familyLabel: 'Pane',
    blurb: 'A window-and-house-washing homepage for a made-up exterior-cleaning business, with residential and commercial service groups.',
    packageName: 'Starter Site',
    whyPackage: 'Starter Site is enough for a short service menu and a contact form, without booking or a large gallery.',
    image: '/sample-homepages/clearwharf-windows.webp',
    imageAlt: 'Sample homepage mockup for a fictional window-washing company named Clearwharf Window Care, with a glass-pane motif.',
  },
  {
    slug: 'larkbend-gardens',
    name: 'Larkbend Garden Studio',
    trade: 'Landscape design',
    family: 'siteplan',
    familyLabel: 'Site plan',
    blurb: 'A landscape-studio homepage for a made-up garden design practice, laid out like a drafted site plan with room for a project gallery.',
    packageName: 'Pro Site',
    whyPackage: 'Pro Site is the better match when a business needs gallery pages and more room than a 1–3 page starter site.',
    image: '/sample-homepages/larkbend-gardens.webp',
    imageAlt: 'Sample homepage mockup for a fictional landscape studio named Larkbend Garden Studio, designed as a drafted site plan.',
  },
  {
    slug: 'oakferry-pet-spa',
    name: 'Oakferry Pet Spa',
    trade: 'Pet grooming',
    family: 'bath',
    familyLabel: 'Bath',
    blurb: 'A pet-grooming homepage for a made-up spa, with a grooming menu and a booking-style page in mind.',
    packageName: 'Pro Site',
    whyPackage: 'Pro Site includes booking or gallery pages, which a grooming business typically needs along with the core contact path.',
    image: '/sample-homepages/oakferry-pet-spa.webp',
    imageAlt: 'Sample homepage mockup for a fictional pet spa named Oakferry Pet Spa, with a rounded, bath-themed layout.',
  },
]

export function packageFor(sample: SampleHomepage): SitePackage {
  const match = packages.find((p) => p.name === sample.packageName)
  if (!match) throw new Error(`Missing package ${sample.packageName}`)
  return match
}
