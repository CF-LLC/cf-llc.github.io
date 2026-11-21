import SiteFooter from '@/components/SiteFooter'

export default function CaseStudyShell({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="site-shell min-h-screen bg-[#070708] text-[#eceae4]">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <a href="/" className="text-sm font-semibold tracking-[0.18em] text-white">CF LLC</a>
        <nav aria-label="Main" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
          <a href="/#packages" className="hover:text-white">Packages</a>
          <a href="/quote" className="hover:text-white">Get a quote</a>
          <a href="/nwa" className="hover:text-white">Bentonville &amp; NWA</a>
          <a href="/sample-homepages" className="hover:text-white">Sample homepages</a>
          <a href="/case-studies" className="hover:text-white">Case studies</a>
          <a href="/ecosystem" className="hover:text-white">Ecosystem</a>
          <a href="/#mockup" className="font-semibold text-white underline underline-offset-4">Free mockup</a>
        </nav>
      </header>
      <main id="main" className={`mx-auto px-5 pb-16 sm:px-8 ${wide ? "max-w-6xl" : "max-w-4xl"}`}>{children}</main>
      <SiteFooter />
    </div>
  )
}
