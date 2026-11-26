import { CF_LLC_SITES } from '@/lib/seo'

export default function SiteFooter({ className = '' }: { className?: string }) {
  return (
    <footer className={`border-t border-white/10 bg-[#05040a]/90 ${className}`.trim()}>
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-10 text-sm text-white/75 sm:px-8">
        <p>CF LLC · Remote, serving small businesses across the US</p>
        <p>
          <a href="/nwa" className="underline">Websites for Bentonville and NWA</a>
          {' · '}
          <a href="/website-care" className="underline">Website Care Plan</a>
          {' · '}
          <a href="mailto:cooperfeatherstonellc@gmail.com" className="underline">cooperfeatherstonellc@gmail.com</a>
        </p>
        <nav aria-label="More from CF LLC" className="mt-4">
          <p className="text-white/60">More from CF LLC</p>
          <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
            {CF_LLC_SITES.map((s) => (
              <li key={s.href}><a href={s.href} className="underline">{s.label}</a></li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
