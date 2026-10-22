import SpaceFlight from '@/components/SpaceFlight'
import { stops } from '@/data/stations'
import BeforeAfter from '@/components/BeforeAfter'
import MockupForm from '@/components/MockupForm'

// Prices: approved price sheet (/workspace/ps.md, matches openclaw-revenue-plan.md).
// Links: live house Stripe payment links (metadata rep=house, source=storefront),
// so storefront sales are credited to the site, not an agent rep.
const packages = [
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

const steps = [
  { t: 'Mockup', b: 'Send your business name and current site. I make a free homepage mockup so you can see the direction first.' },
  { t: 'Approve', b: 'Request changes or approve it. You only pay when you choose a package.' },
  { t: 'Launch', b: 'I build the site and put it live, then keep it running on your plan.' },
]

const faqs = [
  { q: 'Where is my site hosted?', a: 'Starter Site and Pro Site include hosting in the monthly fee, so there is nothing extra to set up. If you already have a site and host, Site Care covers updates and uptime checks for it.' },
  { q: 'Can I make edits later?', a: 'Yes. Starter Site includes updates as part of the monthly fee: email me what you want changed. Pro Site includes 2 revision rounds during the build, and updates after launch are covered by the monthly fee.' },
  { q: 'How long does it take?', a: 'A Starter Site is typically live within about a week of approving your mockup, as long as I have your text and photos. Pro Sites take longer depending on pages and features; I will give you an estimate up front.' },
  { q: 'Do I need to be local?', a: 'No. Everything is done remotely by email, for small businesses anywhere in the US.' },
  { q: 'Is the mockup really free?', a: 'Yes. No payment or commitment to get a homepage mockup.' },
]

export default function Home() {
  return (
    <div className="relative min-h-screen text-[#eceae4]">
      <SpaceFlight />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black">Skip to content</a>
      <header className="fixed inset-x-0 top-0 z-30 border-b border-white/5 bg-[#05040a]/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-x-3 px-4 py-3 sm:px-8 sm:py-4 sm:px-8">
          <a href="#main" className="whitespace-nowrap text-sm font-semibold tracking-[0.18em] text-white">CF LLC</a>
          <nav aria-label="Main" className="flex gap-x-3 text-xs text-white/80 sm:gap-x-5 sm:text-sm">
            <a href="#stop-saas" className="hover:text-white">Projects</a>
            <a href="#packages" className="hover:text-white">Packages</a>
            <a href="/ecosystem" className="hover:text-white">Ecosystem</a>
            <a href="#mockup" className="whitespace-nowrap font-semibold text-white underline underline-offset-4">Free mockup</a>
          </nav>
        </div>
      </header>

      <main id="main" className="relative z-10">
        <div id="flight">
          <h1 className="sr-only">CF LLC: a flight through the projects of a small studio</h1>
          {stops.map((s, i) => (
            <section key={s.id} id={`stop-${s.id}`} aria-labelledby={`t-${s.id}`} className="stop">
              <article data-stop-card className="stop-card" style={{ ['--accent' as string]: s.accent }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: s.accent }}>{s.kicker}</p>
                <h2 id={`t-${s.id}`} className={`mt-2 text-white sm:mt-3 ${i === 0 ? 'text-5xl sm:text-8xl' : 'text-4xl sm:text-6xl'}`}>{s.title}</h2>
                <p className="mt-3 text-sm leading-6 text-white/85 sm:mt-4 sm:text-base sm:leading-7">{s.body}</p>
                <ul className="mt-3 space-y-1.5 text-[13px] leading-5 text-white/80 sm:mt-4 sm:space-y-2 sm:text-[15px]">
                  {s.points.map((p) => <li key={p} className="flex gap-2"><span aria-hidden="true" style={{ color: s.accent }}>✦</span><span>{p}</span></li>)}
                </ul>
                {s.links && (
                  <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
                    {s.links.map((l, k) => (
                      <a key={l.href} href={l.href} className={k === 0 ? 'stop-btn' : 'stop-btn-ghost'}>{l.label}{k === 0 ? ' →' : ''}</a>
                    ))}
                  </div>
                )}
                {i === 0 && <p className="scroll-hint mt-4 sm:mt-8 text-sm text-white/60" aria-hidden="true">Scroll to fly ↓</p>}
              </article>
            </section>
          ))}
        </div>

        <div className="relative">
        <section id="packages" aria-labelledby="packages-title" className="scroll-mt-6 border-t border-white/10 bg-[#0b0a12]/85 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
            <p className="kicker">Packages</p>
            <h2 id="packages-title" className="display-title mt-4 text-4xl text-white sm:text-5xl">Simple, upfront pricing</h2>
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {packages.map((p) => (
                <li key={p.name} className={`flex flex-col rounded-lg border p-6 ${p.featured ? 'border-[#4aa8b8] bg-[#4aa8b8]/10' : 'border-white/15 bg-white/[0.03]'}`}>
                  <h3 className="text-3xl text-white">{p.name}</h3>
                  {p.featured && <p className="mt-1 text-sm font-semibold text-[#8fd3de]">Most popular</p>}
                  <p className="mt-4"><span className="text-4xl font-semibold text-white">{p.price}</span> <span className="text-white/80">{p.priceNote}</span></p>
                  <p className="mt-4 leading-7 text-white/80">{p.blurb}</p>
                  <ul className="mt-4 flex-1 list-disc space-y-1 pl-5 text-white/80">
                    {p.items.map((i) => <li key={i}>{i}</li>)}
                  </ul>
                  <a href={p.href} className="mt-6 rounded-md bg-[#eceae4] px-5 py-3 text-center font-semibold text-[#070708] hover:bg-white">
                    Buy {p.name}<span className="sr-only"> (secure checkout on Stripe)</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-white/75">Checkout is handled securely by Stripe. Not sure which fits? <a href="#mockup" className="underline">Start with a free mockup.</a></p>
          </div>
        </section>

        <section id="process" aria-labelledby="process-title" className="bg-[#07060c]/80 mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <p className="kicker">How it works</p>
          <h2 id="process-title" className="display-title mt-4 text-4xl text-white sm:text-5xl">Mockup, approve, launch</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.t} className="rounded-lg border border-white/15 p-6">
                <p className="text-sm font-semibold text-[#8fd3de]">Step {i + 1}</p>
                <h3 className="mt-2 text-2xl text-white">{s.t}</h3>
                <p className="mt-3 leading-7 text-white/80">{s.b}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="samples" aria-labelledby="samples-title" className="scroll-mt-6 border-t border-white/10 bg-[#0b0a12]/85 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
            <p className="kicker">Proof</p>
            <h2 id="samples-title" className="display-title mt-4 text-4xl text-white sm:text-5xl">Before &amp; after</h2>
            <p className="mt-4 max-w-2xl leading-7 text-white/80">Real CF LLC sites, then and now. Drag the line to compare each earlier version with what&rsquo;s live today.</p>
            <BeforeAfter />
          </div>
        </section>

        <section id="mockup" aria-labelledby="mockup-title" className="scroll-mt-6 bg-[#07060c]/80"><div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2">
          <div>
            <p className="kicker">Free, no commitment</p>
            <h2 id="mockup-title" className="display-title mt-4 text-4xl text-white sm:text-5xl">Get a free homepage mockup</h2>
            <p className="mt-4 leading-7 text-white/80">Tell me your business and current site (if any). I&apos;ll email you a homepage mockup so you can decide with something real in front of you.</p>
          </div>
          <MockupForm />
        </div></section>

        <section id="faq" aria-labelledby="faq-title" className="scroll-mt-6 border-t border-white/10 bg-[#0b0a12]/85 backdrop-blur-sm">
          <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
            <p className="kicker">FAQ</p>
            <h2 id="faq-title" className="display-title mt-4 text-4xl text-white sm:text-5xl">Common questions</h2>
            <div className="mt-8 divide-y divide-white/15 border-y border-white/15">
              {faqs.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="cursor-pointer text-lg font-semibold text-white">{f.q}</summary>
                  <p className="mt-3 leading-7 text-white/80">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        </div>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-[#05040a]/90">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-10 text-sm text-white/75 sm:px-8">
          <p>CF LLC · Remote, serving small businesses across the US</p>
          <p><a href="mailto:cooperfeatherstonellc@gmail.com" className="underline">cooperfeatherstonellc@gmail.com</a></p>
        </div>
      </footer>
    </div>
  )
}
