export default function CaseStudyShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell min-h-screen bg-[#070708] text-[#eceae4]">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <a href="/" className="text-sm font-semibold tracking-[0.18em] text-white">CF LLC</a>
        <nav aria-label="Main" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
          <a href="/#packages" className="hover:text-white">Packages</a>
          <a href="/case-studies" className="hover:text-white">Case studies</a>
          <a href="/ecosystem" className="hover:text-white">Ecosystem</a>
          <a href="/#mockup" className="font-semibold text-white underline underline-offset-4">Free mockup</a>
        </nav>
      </header>
      <main id="main" className="mx-auto max-w-4xl px-5 pb-16 sm:px-8">{children}</main>
      <footer className="border-t border-white/10 bg-[#05040a]/90">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-10 text-sm text-white/75 sm:px-8">
          <p>CF LLC · Remote, serving small businesses across the US</p>
          <p><a href="mailto:cooperfeatherstonellc@gmail.com" className="underline">cooperfeatherstonellc@gmail.com</a></p>
        </div>
      </footer>
    </div>
  )
}
