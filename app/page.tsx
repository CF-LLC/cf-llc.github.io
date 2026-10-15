import ProjectsSection from '@/components/ProjectsSection'
import SampleMockups from '@/components/SampleMockups'
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
    <div className="min-h-screen text-[#eceae4]">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black">Skip to content</a>
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-6 sm:px-8">
        <a href="#main" className="text-sm font-semibold tracking-[0.18em] text-white">CF LLC</a>
        <nav aria-label="Main" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
          <a href="#packages" className="hover:text-white">Packages</a>
          <a href="#samples" className="hover:text-white">Samples</a>
          <a href="#faq" className="hover:text-white">FAQ</a>
          <a href="#mockup" className="font-semibold text-white underline underline-offset-4">Free mockup</a>
        </nav>
      </header>

      <main id="main">
        <section aria-labelledby="hero-title" className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8 sm:pt-16">
          <p className="kicker">Web services for small businesses · Remote, US-wide</p>
          <h1 id="hero-title" className="display-title mt-6 max-w-4xl text-5xl text-white sm:text-7xl">Websites for small businesses, live in a week.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">
            A clean, mobile-friendly site that tells customers what you do and how to reach you. Starter Sites from $499 setup + $39/mo, hosting and updates included.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#mockup" className="rounded-md bg-[#eceae4] px-6 py-3 font-semibold text-[#070708] hover:bg-white">Get a free homepage mockup</a>
            <a href="#packages" className="rounded-md border border-white/50 px-6 py-3 font-semibold text-white hover:border-white">See packages</a>
          </div>
        </section>

        <section id="packages" aria-labelledby="packages-title" className="scroll-mt-6 border-t border-white/10 bg-[#0d0d10]">
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

        <section id="process" aria-labelledby="process-title" className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
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

        <section id="samples" aria-labelledby="samples-title" className="scroll-mt-6 border-t border-white/10 bg-[#0d0d10]">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
            <p className="kicker">Proof</p>
            <h2 id="samples-title" className="display-title mt-4 text-4xl text-white sm:text-5xl">Before &amp; after samples</h2>
            <p className="mt-4 max-w-2xl leading-7 text-white/80">Sample homepage mockups for fictional businesses, to show the kind of change you can expect.</p>
            <SampleMockups />
            <div className="mt-12 rounded-lg border border-white/15 p-6">
              <p className="text-sm font-semibold text-[#8fd3de]">Live store</p>
              <h3 className="mt-2 text-2xl text-white">SpockShop</h3>
              <p className="mt-2 leading-7 text-white/80">A real online store I built and run, with product listings and an admin for managing items.</p>
              <a href="https://spockshop.com" className="mt-4 inline-block font-semibold underline underline-offset-4">Visit spockshop.com →</a>
            </div>
          </div>
        </section>

        <section id="mockup" aria-labelledby="mockup-title" className="scroll-mt-6 mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2">
          <div>
            <p className="kicker">Free, no commitment</p>
            <h2 id="mockup-title" className="display-title mt-4 text-4xl text-white sm:text-5xl">Get a free homepage mockup</h2>
            <p className="mt-4 leading-7 text-white/80">Tell me your business and current site (if any). I&apos;ll email you a homepage mockup so you can decide with something real in front of you.</p>
          </div>
          <MockupForm />
        </section>

        <section id="faq" aria-labelledby="faq-title" className="scroll-mt-6 border-t border-white/10 bg-[#0d0d10]">
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

        <section id="work" aria-labelledby="work-title" className="scroll-mt-6 mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <ProjectsSection />
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-10 text-sm text-white/75 sm:px-8">
          <p>CF LLC, 2510 NW Turner Dr, Bentonville, AR 72712</p>
          <p><a href="mailto:cooperfeatherstonellc@gmail.com" className="underline">cooperfeatherstonellc@gmail.com</a></p>
        </div>
      </footer>
    </div>
  )
}
