// Website Care Plan: $99/month, sold through the inquiry form (no live billing link yet).
export const CARE_PLAN = {
  name: 'Website Care Plan',
  price: '$99',
  period: 'per month',
  tagline: 'Your website, looked after by the person who built it. Cancel anytime.',
  inquiryHref: '/website-care?interest=care-plan#start',
  homeInquiryHref: '/?interest=care-plan#mockup',
}

export const careIncludes = [
  { icon: 'activity', title: 'Hosting & uptime monitoring', body: 'Your site is checked around the clock. If it goes down, I find out right away and get it back up.' },
  { icon: 'shield', title: 'Security & plugin updates', body: 'Platform, plugin and dependency updates applied and tested, so known holes get closed instead of piling up.' },
  { icon: 'database', title: 'Monthly backups', body: 'A full backup every month, so a bad update or an honest mistake can be rolled back instead of becoming a disaster.' },
  { icon: 'pencil', title: 'Up to 1 hour of edits a month', body: 'New hours, a price change, a fresh photo, a new section. Email me what you want changed and it gets done.' },
  { icon: 'chart', title: 'Monthly health report', body: 'A short, plain-English email: uptime, what was updated, what was backed up, and anything worth your attention.' },
  { icon: 'mail', title: 'Fast email support', body: 'Questions answered by email, by me, not a ticket queue. I aim to reply within one business day.' },
] as const

export const careFaqs = [
  { q: 'Does it work with a site you did not build?', a: 'In most cases, yes. Send me the address and I will take a look first. If I cannot support it well, I will tell you before you pay anything.' },
  { q: 'What if I need more than one hour of edits?', a: 'Extra edits are available at a simple hourly rate that I will quote you up front. Unused edit time does not roll over.' },
  { q: 'How is this different from Site Care ($49/mo)?', a: 'Site Care covers updates, uptime checks and a monthly report. The Care Plan adds monthly off-site backups, security and plugin updates, up to 1 hour of content edits, and priority email support.' },
  { q: 'How do I sign up?', a: 'Send the short form on this page. I will reply by email, look at your site, confirm it is a fit, and set up your first month. There is no long contract.' },
  { q: 'Can I cancel?', a: 'Anytime. Tell me by email and the plan ends at the close of the month you are in. No fees, no hoops.' },
]
