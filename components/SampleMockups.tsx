type Sample = {
  trade: string
  name: string
  tagline: string
  cta: string
  accent: string
  bg: string
  fg: string
  services: string[]
}

const samples: Sample[] = [
  { trade: 'Bakery', name: 'Maple Street Bakery', tagline: 'Fresh bread and custom cakes, baked daily.', cta: 'Order a cake', accent: '#b4532a', bg: '#fbf3e8', fg: '#2b1d14', services: ['Daily bread', 'Custom cakes', 'Catering'] },
  { trade: 'Welder', name: 'Ridge Line Welding', tagline: 'Mobile welding and custom fabrication.', cta: 'Get a quote', accent: '#e0751c', bg: '#1d2329', fg: '#f2f4f6', services: ['Mobile repair', 'Gates & railings', 'Trailer work'] },
  { trade: 'Landscaper', name: 'Greenway Landscaping', tagline: 'Lawn care and landscape design for local homes.', cta: 'Book an estimate', accent: '#2f7d3b', bg: '#f1f7ef', fg: '#15301a', services: ['Weekly mowing', 'Planting', 'Hardscapes'] },
]

function Before({ s }: { s: Sample }) {
  return (
    <div className="h-full rounded border border-gray-400 bg-white p-3 font-serif text-[11px] leading-4 text-gray-800" aria-hidden="true">
      <p className="text-center text-base font-bold text-blue-800 underline">Welcome to {s.name}!!!</p>
      <p className="mt-1 text-center text-[10px] text-gray-500">Best viewed in Internet Explorer</p>
      <div className="mt-2 h-10 border border-dashed border-gray-400 bg-gray-200 text-center leading-10 text-gray-500">[image not found]</div>
      <p className="mt-2">We are a family owned {s.trade.toLowerCase()} business serving the area for many years. Call us for more information about our services and pricing. Click here for our hours.</p>
      <p className="mt-2 text-blue-800 underline">Home | About | Services | Contact | Links</p>
      <p className="mt-2 text-gray-500">Last updated 2014</p>
    </div>
  )
}

function After({ s }: { s: Sample }) {
  return (
    <div className="h-full overflow-hidden rounded border border-black/10 text-[11px] leading-4" style={{ background: s.bg, color: s.fg }} aria-hidden="true">
      <div className="flex items-center justify-between px-3 py-2">
        <span className="font-sans text-xs font-bold">{s.name}</span>
        <span className="rounded px-2 py-0.5 font-sans text-[10px] font-semibold text-white" style={{ background: s.accent }}>Call</span>
      </div>
      <div className="px-3 pb-3 pt-2">
        <p className="font-sans text-base font-bold leading-5">{s.tagline}</p>
        <span className="mt-2 inline-block rounded px-3 py-1 font-sans text-[10px] font-semibold text-white" style={{ background: s.accent }}>{s.cta}</span>
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {s.services.map((x) => (
            <div key={x} className="rounded bg-black/5 px-1.5 py-2 text-center font-sans text-[10px] font-medium">{x}</div>
          ))}
        </div>
        <p className="mt-2 font-sans text-[10px] opacity-80">★★★★★ Reviews · Hours · Map</p>
      </div>
    </div>
  )
}

export default function SampleMockups() {
  return (
    <ul className="mt-10 grid gap-8 lg:grid-cols-3">
      {samples.map((s) => (
        <li key={s.trade} className="rounded-lg border border-white/15 bg-white/[0.03] p-5">
          <figure>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl text-white">{s.trade}</h3>
              <span className="rounded-full border border-yellow-300/70 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-yellow-200">Sample</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/75">Before</p>
                <Before s={s} />
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/75">After</p>
                <After s={s} />
              </div>
            </div>
            <figcaption className="mt-3 text-sm text-white/75">
              Sample mockup for a fictional {s.trade.toLowerCase()} (&ldquo;{s.name}&rdquo;): a dated page vs. a clear, mobile-first homepage with one main call to action. Not a real client.
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}
