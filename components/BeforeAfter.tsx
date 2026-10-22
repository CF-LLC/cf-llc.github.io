'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

type Shot = { src: string; label: string; alt: string }
type Pair = { id: string; project: string; href: string; hrefLabel: string; span: string; before: Shot; after: Shot; changes: string[] }

// Every image is a real CF LLC screen. "Before" shots are genuine earlier versions,
// rebuilt from git history and captured at the same 1440x900 viewport as the "after".
const pairs: Pair[] = [
  {
    id: 'cfllc', project: 'CF LLC home', href: 'https://cf-llc.github.io/', hrefLabel: 'You are here', span: 'Apr 2026 → Oct 2026',
    before: { src: '/samples/cfllc-2026-04', label: 'Apr 2026', alt: 'CF LLC homepage in April 2026: a generic agency hero reading "Build smarter systems. Launch faster experiences."' },
    after: { src: '/samples/cfllc-v3-2026-10-21', label: 'Oct 2026', alt: 'CF LLC homepage in October 2026: a first-person 3D flight past a glowing star with an information panel.' },
    changes: ['Generic agency copy replaced with one clear offer and price', 'First-person 3D flight past every live product', 'One main action: a free homepage mockup'],
  },
  {
    id: 'spockshop', project: 'SpockShop', href: 'https://spockshop.com/', hrefLabel: 'spockshop.com', span: 'Aug 2026 → Oct 2026',
    before: { src: '/samples/spockshop-2026-08', label: 'Aug 2026', alt: 'SpockShop first build in August 2026: a cream page with a single dark hero card.' },
    after: { src: '/samples/spockshop-2026-10', label: 'Oct 2026', alt: 'SpockShop in October 2026: a full dark space theme with Closet Picks and Amazon Picks calls to action.' },
    changes: ['First build turned into a full space-themed store', 'Two clear ways to shop: Closet Picks and Amazon Picks', 'Admin added behind it: drafts, approvals, Depop bulk import'],
  },
  {
    id: 'funnelmaker', project: 'Funnel Maker', href: 'https://funnels.saasnation.site/', hrefLabel: 'funnels.saasnation.site', span: 'v1 → v2, Oct 2026',
    before: { src: '/samples/funnelmaker-v1-2026-10-16', label: 'v1', alt: 'Funnel Maker v1: a plain white page with a headline and a four-step "How it works" list.' },
    after: { src: '/samples/funnelmaker-v2-2026-10-20', label: 'v2', alt: 'Funnel Maker v2: a bright headline over a gallery of animated funnel templates.' },
    changes: ['Plain text page became a live template gallery', 'Benefit-led headline and a single "Start free" action', 'Guided builder, fresh palette and a full mobile pass'],
  },
  {
    id: 'flight', project: 'Space flight', href: 'https://cf-llc.github.io/', hrefLabel: 'Fly it above', span: 'v1 → v3, Oct 2026',
    before: { src: '/samples/cfllc-v1-2026-10-20', label: 'v1', alt: 'Space site v1: a flat starfield with small planets behind the headline.' },
    after: { src: '/samples/cfllc-v3-2026-10-21', label: 'v3', alt: 'Space site v3: a close, lit 3D star with asteroids passing the camera.' },
    changes: ['Flat starfield became a true 3D first-person flight', 'Lit planets, close-pass asteroids and warp streaks', 'Mouse and gyro look-around, with 3D on phones too'],
  },
]

function Img({ shot, eager }: { shot: Shot; eager?: boolean }) {
  return (
    <img
      src={`${shot.src}-1440.webp`}
      srcSet={`${shot.src}-720.webp 720w, ${shot.src}-1440.webp 1440w`}
      sizes="(min-width: 1152px) 1088px, 100vw"
      width={1440} height={900} alt={shot.alt}
      loading={eager ? 'eager' : 'lazy'} decoding="async" draggable={false}
      className="absolute inset-0 h-full w-full select-none object-cover object-top"
    />
  )
}

function Slider({ pair }: { pair: Pair }) {
  const [pos, setPos] = useState(50)
  const box = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  useEffect(() => setPos(50), [pair.id])
  const fromX = useCallback((x: number) => {
    const r = box.current?.getBoundingClientRect(); if (!r) return
    setPos(Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100)))
  }, [])
  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey || e.key.startsWith('Page') ? 10 : 2
    const map: Record<string, number> = { ArrowLeft: -step, ArrowDown: -step, PageDown: -step, ArrowRight: step, ArrowUp: step, PageUp: step }
    if (e.key in map) { e.preventDefault(); setPos((p) => Math.max(0, Math.min(100, p + map[e.key]))) }
    else if (e.key === 'Home') { e.preventDefault(); setPos(0) } else if (e.key === 'End') { e.preventDefault(); setPos(100) }
  }
  return (
    <div
      ref={box}
      className="ba-frame relative aspect-[16/10] w-full cursor-ew-resize overflow-hidden rounded-md bg-[#05040a]"
      style={{ touchAction: 'pan-y' }}
      onPointerDown={(e) => { dragging.current = true; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); fromX(e.clientX) }}
      onPointerMove={(e) => { if (dragging.current) fromX(e.clientX) }}
      onPointerUp={() => { dragging.current = false }}
      onPointerCancel={() => { dragging.current = false }}
    >
      <Img shot={pair.after} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Img shot={pair.before} />
      </div>
      <span className="ba-tag left-3">Before · {pair.before.label}</span>
      <span className="ba-tag right-3">After · {pair.after.label}</span>
      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
        <div className="ba-line absolute inset-y-0 -left-px w-0.5" />
      </div>
      <div
        role="slider" tabIndex={0}
        aria-label={`${pair.project}: drag to compare before and after`}
        aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)}% before (${pair.before.label}) shown`}
        onKeyDown={onKey}
        className="ba-knob absolute top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
        style={{ left: `${pos}%` }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 6l-6 6 6 6M15 6l6 6-6 6" /></svg>
      </div>
    </div>
  )
}

export default function BeforeAfter() {
  const [i, setI] = useState(0)
  const pair = pairs[i]
  return (
    <div className="mt-10">
      <div role="tablist" aria-label="Choose a project" className="ba-tabs -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
        {pairs.map((p, k) => (
          <button key={p.id} role="tab" id={`ba-tab-${p.id}`} aria-selected={k === i} aria-controls="ba-panel" onClick={() => setI(k)}
            className={`ba-tab shrink-0 ${k === i ? 'is-active' : ''}`}>
            <span className="ba-tab-n">0{k + 1}</span> {p.project}
          </button>
        ))}
      </div>
      <figure id="ba-panel" role="tabpanel" aria-labelledby={`ba-tab-${pair.id}`} className="ba-panel mt-4 p-2 sm:p-3">
        <span className="ba-corner tl" /><span className="ba-corner tr" /><span className="ba-corner bl" /><span className="ba-corner br" />
        <Slider pair={pair} />
        <figcaption className="grid gap-5 px-2 pb-2 pt-5 sm:px-3 md:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="ba-meta">Real project · {pair.span}</p>
            <h3 className="mt-2 text-2xl text-white">{pair.project}</h3>
            <a href={pair.href} className="mt-2 inline-block text-sm font-semibold text-[#8fd3de] underline underline-offset-4">{pair.hrefLabel} →</a>
          </div>
          <div>
            <p className="ba-meta">What changed</p>
            <ul className="mt-2 grid gap-2">
              {pair.changes.map((c) => (
                <li key={c} className="flex gap-3 text-sm leading-6 text-white/85"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-[#9fe9ff]" />{c}</li>
              ))}
            </ul>
          </div>
        </figcaption>
      </figure>
      <p className="mt-4 text-xs text-white/55">Drag the handle, or focus it and use the arrow keys. Before shots are earlier versions rebuilt from git history; all screenshots taken at the same 1440×900 viewport.</p>
    </div>
  )
}
