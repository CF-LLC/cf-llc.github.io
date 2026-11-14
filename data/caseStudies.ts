// Case studies for CF LLC's own live products (Nov 13, 2026).
// RULE: only real, publicly checkable numbers. Anything we can't show yet stays a visible "to be added" spot.
// To fill a spot later, set its `value` (and keep `source` pointing at where anyone can check it).
export type Metric = { label: string; value: string | null; source?: string }
export type CaseStudy = {
  slug: string
  name: string
  url: string
  tagline: string
  summary: string
  problem: string
  built: string[]
  stack: string[]
  metrics: Metric[]
  accent: string
}

export const CHECKED_ON = 'November 13, 2026'

export const caseStudies: CaseStudy[] = [
  {
    slug: 'saas-nation',
    name: 'SaaS Nation',
    url: 'https://saasnation.site/',
    tagline: 'A library of small business tools for coaches and creators',
    summary: 'One account, many focused tools: invoices, proposals, booking, forms, a client list, an email list, digital downloads, a client portal and more. Buy the one tool you need or get All Access.',
    problem: 'Coaches and solo businesses often pay for several separate apps to handle basic jobs like booking, invoicing and intake forms.',
    built: [
      'A Next.js app with per-tool access, so each tool can be bought on its own or as part of All Access',
      'Customers are paid through their own Stripe Payment Links; SaaS Nation takes no cut',
      'Free no-signup tools and free copy-paste templates that lead visitors to the paid tools',
      'Self-hosted on our own server behind a Cloudflare Tunnel',
    ],
    stack: ['Next.js', 'Supabase', 'Stripe Payment Links', 'Docker', 'Cloudflare'],
    metrics: [
      { label: 'Tools live', value: '18', source: 'https://saasnation.site/pricing' },
      { label: 'Price', value: '$12/mo per tool or $29/mo All Access', source: 'https://saasnation.site/pricing' },
      { label: 'Free templates', value: '17', source: 'https://saasnation.site/free-templates' },
      { label: 'Paying customers', value: null },
      { label: 'Monthly visitors', value: null },
    ],
    accent: '#ff7ad9',
  },
  {
    slug: 'spockshop',
    name: 'SpockShop',
    url: 'https://spockshop.com/',
    tagline: "Spock's Resale Shop: curated finds plus the Daily Drop",
    summary: 'A self-hosted online store with hand-picked resale items, Amazon picks and the Daily Drop: original illustrated tees, hoodies, mugs and hats printed to order.',
    problem: 'A small resale business needed its own store, without monthly platform fees or giving up its customer list.',
    built: [
      'A Next.js storefront and admin running on our own server with Postgres',
      'The Daily Drop: original designs sold as print-on-demand products with checkout through Stripe',
      'Product pages with structured data and a sitemap so items can be found in search',
      'A drop email signup with clear consent and a one-click unsubscribe',
    ],
    stack: ['Next.js', 'Postgres', 'Stripe', 'Printful', 'Docker', 'Cloudflare'],
    metrics: [
      { label: 'Daily Drop designs live', value: '15', source: 'https://spockshop.com/drop' },
      { label: 'Tee price', value: '$28', source: 'https://spockshop.com/drop' },
      { label: 'Orders', value: null },
      { label: 'Email subscribers', value: null },
    ],
    accent: '#7fe3ff',
  },
  {
    slug: 'satoshis-path',
    name: "Satoshi's Path",
    url: 'https://satoshispath.netlify.app/',
    tagline: 'Bitcoin basics for ordinary budgets',
    summary: 'A free learning site for people new to bitcoin: plain-English guides, calculators, and honest comparisons of where to buy and how to store bitcoin safely.',
    problem: 'Beginners face a wall of hype and sales pitches. They need plain answers and sources they can check.',
    built: [
      'A fast static site (Next.js export) hosted for free',
      'Beginner guides and calculators (DCA, HODL, fees, unit converter, price tracker)',
      'Exchange and hardware wallet comparisons using facts checked against official sources, with a clear affiliate disclosure',
    ],
    stack: ['Next.js (static export)', 'Netlify', 'GitHub Pages', 'Cloudflare Workers'],
    metrics: [
      { label: 'Guides', value: '6', source: 'https://satoshispath.netlify.app/guides/' },
      { label: 'Exchanges compared', value: '7', source: 'https://satoshispath.netlify.app/buy-bitcoin/' },
      { label: 'Hardware wallets compared', value: '8', source: 'https://satoshispath.netlify.app/tools/' },
      { label: 'Monthly readers', value: null },
      { label: 'Email subscribers', value: null },
    ],
    accent: '#ffb347',
  },
  {
    slug: 'openclaw',
    name: 'OpenClaw',
    url: '/#mockup',
    tagline: 'Free homepage mockups for local businesses',
    summary: 'Our own system for finding local businesses whose websites could work harder, building them a free homepage mockup to look at, and reaching out once, personally.',
    problem: 'Small businesses rarely have time to picture what a better website would look like. Showing them a mockup first makes the decision easy.',
    built: [
      'A pipeline that drafts a homepage mockup from a business’s own public information',
      'A private dashboard for reviewing mockups and outreach',
      'Sending safeguards: daily caps, a short hold before each email goes out, an automatic pause if too many emails bounce, and an unsubscribe link in every email',
    ],
    stack: ['Node.js', 'Postgres', 'Docker', 'Cloudflare'],
    metrics: [
      { label: 'Mockups delivered', value: null },
      { label: 'Sites launched from a mockup', value: null },
    ],
    accent: '#ffd27a',
  },
]

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug)
