// Live storefront packages. Prices match the approved price sheet and the home page.
// Stripe links are the existing house payment links (metadata rep=house, source=storefront).
export type SitePackage = {
  name: string
  price: string
  priceNote: string
  blurb: string
  items: string[]
  href: string
  featured: boolean
}

export const packages: SitePackage[] =
[
  {
    name: 'Starter Site',
    price: '$499',
    priceNote: 'setup + $39/mo',
    blurb: 'A 1–3 page mobile site with a contact form. Hosting and updates included in the monthly fee.',
    items: ['1–3 pages', 'Mobile-first design', 'Contact form', 'Hosting & updates'],
    href: 'https://buy.stripe.com/14A28rg2Ua0p0nE77V4c80l',
    featured: true,
  },
  {
    name: 'Pro Site',
    price: '$1,200',
    priceNote: 'setup + $59/mo',
    blurb: 'More room for a growing business: booking, menu or gallery pages, plus basic SEO.',
    items: ['Up to 8 pages', 'Booking, menu or gallery', 'Basic SEO', '2 revision rounds'],
    href: 'https://buy.stripe.com/4gMdR9bME3C1daq1NB4c80m',
    featured: false,
  },
  {
    name: 'Site Care',
    price: '$49',
    priceNote: 'per month',
    blurb: 'Already have a site? I keep it updated and watched.',
    items: ['Updates', 'Uptime checks', 'Monthly report', 'For an existing site'],
    href: 'https://buy.stripe.com/dRm8wP6ska0pdaqdwj4c80n',
    featured: false,
  },
]
