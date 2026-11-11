// Stops on the home-page flight. Facts only from live sites and repos. No street address, no phone, no private URLs.
export type Stop = {
  id: string
  kicker: string
  title: string
  body: string
  points: string[]
  links?: { label: string; href: string }[]
  accent: string
}

export const stops: Stop[] = [
  {
    id: 'about', kicker: 'Stop 1 · Home star', title: 'CF LLC',
    body: 'A one-person studio that builds and runs its own fleet of websites and software, and builds mobile-friendly websites for small businesses anywhere in the US.',
    points: ['Starter Sites from $499 setup + $39/mo', 'Live in about a week after mockup approval', 'Everything done remotely, by email'],
    links: [{ label: 'Free homepage mockup', href: '#mockup' }, { label: 'See packages', href: '#packages' }],
    accent: '#ffd27a',
  },
  {
    id: 'saas', kicker: 'Stop 2 · The SaaS system', title: 'SaaS Nation',
    body: 'SaaS Nation is live: a library of focused tools for coaches and creators. Get the one tool you need, or All Access to every tool we have and every tool we launch next.',
    points: [
      'All Access: every tool for $29/mo or $249/yr',
      'Or pick a single tool for $12/mo or $99/yr',
      'Monthly plans include a 7-day free trial',
    ],
    links: [
      { label: 'See pricing', href: 'https://saasnation.site/pricing' },
      { label: 'SaaS Nation', href: 'https://saasnation.site/' },
    ],
    accent: '#ff7ad9',
  },
  {
    id: 'spockshop', kicker: 'Stop 3 · Blue planet', title: 'SpockShop',
    body: "Spock's Resale Shop: a real, self-hosted online store with curated finds and sci-fi collectibles, plus a blog and gift guides.",
    points: ['Categorized catalog with a self-hosted admin', 'Ship-to-you checkout', 'New listings reviewed as drafts before they go live'],
    links: [{ label: 'Visit spockshop.com', href: 'https://spockshop.com/' }, { label: 'Read the blog', href: 'https://blog.spockshop.com/' }],
    accent: '#7fe3ff',
  },
  {
    id: 'ecosystem', kicker: 'Stop 4 · The constellation', title: 'Ecosystem & repos',
    body: 'Every site, tool and repository on one interactive 3D star map: live products up front, experiments drifting in the Outer Darkness, and private projects shown only as anonymous lights.',
    points: ['Live status for public sites', 'Public repos fetched at every build', 'Private work counted, never exposed'],
    links: [{ label: 'Open the ecosystem map', href: '/ecosystem' }, { label: 'GitHub', href: 'https://github.com/CF-LLC' }],
    accent: '#a6ffd9',
  },
  {
    id: 'contact', kicker: 'Stop 5 · Beacon', title: 'Say hello',
    body: 'Want a site for your business, or curious about anything you flew past? Send an email and you will hear back from a real person.',
    points: ['Free homepage mockup, no commitment', 'Remote, US-wide'],
    links: [{ label: 'cooperfeatherstonellc@gmail.com', href: 'mailto:cooperfeatherstonellc@gmail.com' }, { label: 'Get a free mockup', href: '#mockup' }],
    accent: '#b9bcff',
  },
]
