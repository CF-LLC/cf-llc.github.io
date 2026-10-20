// Stops on the home-page flight. Public stops link out; private stops have NO url or hostname, only a description.
export type Station = {
  id: string
  kind: 'planet' | 'station' | 'gas' | 'moon'
  name: string
  kicker: string
  blurb: string
  points: string[]
  url?: string
  cta?: string
  private?: boolean
  color: string
  accent: string
  rings?: boolean
}

export const stations: Station[] = [
  {
    id: 'spockshop', kind: 'planet', name: 'SpockShop', kicker: 'Live store · spockshop.com',
    blurb: "Spock's Resale Shop: a real online store with curated finds, sci-fi collectibles and everyday picks, shipped to your door.",
    points: ['Self-hosted storefront and admin', 'Bulk Depop import into reviewable drafts', 'Blog and gift guides'],
    url: 'https://spockshop.com/', cta: 'Visit SpockShop', color: '#2f7fd6', accent: '#7fe3ff',
  },
  {
    id: 'funnels', kind: 'station', name: 'Funnel Maker', kicker: 'SaaS · funnels.saasnation.site',
    blurb: 'Build a landing page, waitlist or launch funnel in three steps: pick an animated template, click to edit, publish.',
    points: ['Live click-to-edit preview', 'Animated templates that respect reduced motion', 'Works on phones end to end'],
    url: 'https://funnels.saasnation.site/', cta: 'Open Funnel Maker', color: '#b84de0', accent: '#ff7ad9',
  },
  {
    id: 'saasnation', kind: 'gas', name: 'SaaS Nation', kicker: 'Coming soon · saasnation.site',
    blurb: 'A growing library of small, focused software tools for creators and small businesses. Funnel Maker is the first to launch.',
    points: ['One account, many tools', 'Fair monthly pricing', 'Join the waitlist for early access'],
    url: 'https://saasnation.site/', cta: 'Join the waitlist', color: '#e0823c', accent: '#ffd27a', rings: true,
  },
  {
    id: 'claw', kind: 'station', name: 'OpenClaw · Claw', kicker: 'Internal · agent operations',
    blurb: 'The mission-control deck for a small crew of AI agents that research leads and draft outreach, with a human approving every send.',
    points: ['Daily send caps, opt-out and pause built in', 'Per-agent pause and status', 'Private dashboard, not public'],
    private: true, color: '#3cc9a0', accent: '#a6ffd9',
  },
  {
    id: 'bounty', kind: 'moon', name: 'Bounty', kicker: 'Internal · research tracker',
    blurb: 'A private tracker for responsible security research: findings, status and follow-ups in one place.',
    points: ['Private, access-gated', 'Nightly backups', 'Responsible disclosure only'],
    private: true, color: '#c43b72', accent: '#ff9fc4',
  },
  {
    id: 'chess', kind: 'planet', name: 'Chess Coach Copilot', kicker: 'In preview',
    blurb: 'Tools that help chess coaches turn student games into lesson notes and practice packs, faster.',
    points: ['Game review to lesson plan', 'Practice packs for students', 'Private preview with coaches'],
    private: true, color: '#d9d2c0', accent: '#fff4d6',
  },
  {
    id: 'hq', kind: 'moon', name: 'HQ & tools', kicker: 'Internal · the back office',
    blurb: 'An HQ dashboard, a sales-team board and social tools keep the whole fleet running, quietly and privately.',
    points: ['Money and system health at a glance', 'Social scheduling tools', 'Private by design'],
    private: true, color: '#6b6fd6', accent: '#b9bcff',
  },
  {
    id: 'ecosystem', kind: 'gas', name: 'The Ecosystem', kicker: 'Map · /ecosystem',
    blurb: 'See every site, tool and repo on one interactive 3D star map, from live products to the Outer Darkness of experiments.',
    points: ['Live status for public sites', 'Repos fetched at build time', 'Private projects shown anonymously'],
    url: '/ecosystem', cta: 'Explore the map', color: '#4aa8b8', accent: '#b9f3ff', rings: true,
  },
]
