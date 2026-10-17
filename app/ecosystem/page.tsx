import type { Metadata } from 'next'
import EcosystemGraph from '../../components/EcosystemGraph'

export const metadata: Metadata = {
  title: 'My Ecosystem — CF LLC',
  description: 'An interactive 3D map of the sites and tools in the CF LLC ecosystem.',
}

export default function EcosystemPage() {
  return (
    <div className="site-shell min-h-screen bg-[#070708] text-[#eceae4]">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <a href="/" className="text-sm font-semibold tracking-[0.18em] text-white">CF LLC</a>
        <nav aria-label="Main" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
          <a href="/#packages" className="hover:text-white">Packages</a>
          <a href="/#samples" className="hover:text-white">Samples</a>
          <a href="/#faq" className="hover:text-white">FAQ</a>
          <a href="/ecosystem" aria-current="page" className="text-white">Ecosystem</a>
          <a href="/#mockup" className="font-semibold text-white underline underline-offset-4">Free mockup</a>
        </nav>
      </header>
      <main id="main" className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <EcosystemGraph />
      </main>
    </div>
  )
}
