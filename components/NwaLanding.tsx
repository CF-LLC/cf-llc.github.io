import MockupForm from './MockupForm'
import CaseStudyShell from './CaseStudyShell'
import { packages } from '@/data/packages'

const SITE = 'https://cf-llc.github.io'

const faqs = [
  {
    q: 'Do I need to be in Bentonville or NWA?',
    a: 'No. I work with Bentonville and Northwest Arkansas small businesses the same way I work with clients anywhere in the US: remotely, by email. A free homepage mockup comes first; you only pay when you choose a package.',
  },
  {
    q: 'How long does a Starter Site take?',
    a: 'A Starter Site is typically live within about a week of approving your mockup, as long as I have your text and photos. Pro Sites take longer depending on pages and features; I will give you an estimate up front.',
  },
  {
    q: 'Is the mockup really free?',
    a: 'Yes. No payment or commitment to get a homepage mockup.',
  },
]

export const nwaMeta = {
  title: 'Websites for Bentonville and NWA small businesses — CF LLC',
  description:
    'Mobile-friendly websites for small businesses in Bentonville and Northwest Arkansas. Starter Site $499 setup + $39/mo, Pro Site $1,200 setup + $59/mo, Site Care $49/mo. Get a free homepage mockup.',
  canonical: `${SITE}/nwa`,
}

export default function NwaLanding() {
  return (
    <CaseStudyShell wide>
      <p className="kicker mt-6">Bentonville &amp; Northwest Arkansas</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Websites for Bentonville and NWA small businesses</h1>
      <p className="mt-4 max-w-2xl leading-7 text-white/80">
        CF LLC builds mobile-friendly websites for small businesses in Bentonville and Northwest Arkansas, and remotely across the US.
        You see a free homepage mockup first. You only pay when you choose a package.
      </p>

      <section id="packages" aria-labelledby="nwa-packages-title" className="mt-14">
        <p className="kicker">Packages</p>
        <h2 id="nwa-packages-title" className="display-title mt-4 text-3xl text-white sm:text-4xl">Simple, upfront pricing</h2>
        <p className="mt-3 text-sm text-white/70">The same packages as on the <a href="/#packages" className="underline">CF LLC home page</a>.</p>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
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
        <p className="mt-6 text-sm text-white/75">Checkout is handled securely by Stripe. Not sure which fits? Start with a free mockup below.</p>
      </section>

      <section id="mockup" aria-labelledby="nwa-mockup-title" className="mt-16 scroll-mt-6">
        <p className="kicker">Free, no commitment</p>
        <h2 id="nwa-mockup-title" className="display-title mt-4 text-3xl text-white sm:text-4xl">Get a free homepage mockup</h2>
        <p className="mt-4 max-w-2xl leading-7 text-white/80">Tell me your business and current site (if any). I&apos;ll email you a homepage mockup so you can decide with something real in front of you.</p>
        <div className="mt-8 max-w-xl">
          <MockupForm />
        </div>
      </section>

      <section id="faq" aria-labelledby="nwa-faq-title" className="mt-16">
        <p className="kicker">FAQ</p>
        <h2 id="nwa-faq-title" className="display-title mt-4 text-3xl text-white sm:text-4xl">Common questions</h2>
        <div className="mt-8 divide-y divide-white/15 border-y border-white/15">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="cursor-pointer text-lg font-semibold text-white">{f.q}</summary>
              <p className="mt-3 leading-7 text-white/80">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section aria-labelledby="nwa-sources-title" className="mt-16 text-sm text-white/60">
        <h2 id="nwa-sources-title" className="font-semibold uppercase tracking-[0.18em] text-white/50">Sources</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Package names and prices (Starter Site $499 setup + $39/mo, Pro Site $1,200 setup + $59/mo, Site Care $49/mo) are the same figures published on the <a href="/#packages" className="underline">Packages section</a> of this site.</li>
          <li>Turnaround wording for a Starter Site matches the <a href="/#faq" className="underline">FAQ on the home page</a>.</li>
          <li>The free mockup request uses the same email form as the rest of this site. There are no testimonials or performance statistics on this page.</li>
        </ul>
      </section>
    </CaseStudyShell>
  )
}
