import type { Metadata } from 'next'
import CaseStudyShell from '@/components/CaseStudyShell'
import { packages } from '@/data/packages'
import { packageFor, sampleHomepages } from '@/data/sampleHomepages'

const starter = packages.find((p) => p.name === 'Starter Site')!
const pro = packages.find((p) => p.name === 'Pro Site')!

export const metadata: Metadata = {
  title: 'Sample homepages — CF LLC',
  description:
    'Sample homepage mockups with made-up business names, showing layout options for Starter Site ($499 setup + $39/mo) and Pro Site ($1,200 setup + $59/mo). These are not client sites.',
}

export default function SampleHomepagesPage() {
  return (
    <CaseStudyShell wide>
      <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Sample homepages</h1>
      <p className="mt-3 max-w-3xl text-white/75">
        These are sample homepage mockups I use to show layout options. Every business name, town, and line of copy on the mockups is made up.
        They are not live client sites, and they do not use real business data or contact details.
      </p>
      <p className="mt-3 max-w-3xl text-sm text-white/70">
        Each sample is paired with the live package it would map to:{' '}
        <a href={starter.href} className="underline">Starter Site {starter.price} {starter.priceNote}</a>
        {' '}or{' '}
        <a href={pro.href} className="underline">Pro Site {pro.price} {pro.priceNote}</a>
        . Those prices are the same figures published on the <a href="/#packages" className="underline">Packages section</a> of this site.
      </p>

      <ul className="mt-10 grid gap-8 lg:grid-cols-2">
        {sampleHomepages.map((sample) => {
          const pkg = packageFor(sample)
          return (
            <li key={sample.slug} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sample.image}
                alt={sample.imageAlt}
                width={1440}
                height={900}
                className="h-auto w-full border-b border-white/10 bg-black"
              />
              <div className="p-6">
                <p className="kicker">{sample.familyLabel} · {sample.trade}</p>
                <h2 className="mt-2 text-2xl font-bold text-white">{sample.name}</h2>
                <p className="mt-2 text-sm text-white/70">{sample.blurb}</p>
                <p className="mt-3 text-sm text-white/70">{sample.whyPackage}</p>
                <a href={pkg.href} className="mt-5 inline-block rounded-md bg-[#eceae4] px-5 py-3 text-center font-semibold text-[#070708] hover:bg-white">
                  {pkg.name} · {pkg.price} {pkg.priceNote}
                </a>
              </div>
            </li>
          )
        })}
      </ul>

      <p className="mt-10 max-w-3xl text-sm text-white/70">
        Want a mockup of your actual business? <a href="/#mockup" className="underline">Request a free homepage mockup</a>.
        No payment or commitment to get one.
      </p>
    </CaseStudyShell>
  )
}
