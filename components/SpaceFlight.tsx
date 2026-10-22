'use client'

import { useEffect, useRef, useState } from 'react'
import { stops } from '../data/stations'

function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')) } catch { return false }
}

type Mode = 'loading' | 'live' | 'none'

// Full-screen first-person flight. three.js is bundled from npm into the site (no CDN).
// The 3D scene is the default on every device. It only falls back to a flat page if WebGL really fails,
// and says so on screen. Reduced-motion keeps the 3D scene with gentler motion.
export default function SpaceFlight() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [mode, setMode] = useState<Mode>('loading')
  const [why, setWhy] = useState('')
  const [gyroAsk, setGyroAsk] = useState(false)
  const hud = useRef<{ sector: HTMLElement | null; name: HTMLElement | null; vel: HTMLElement | null; bar: HTMLElement | null }>({ sector: null, name: null, vel: null, bar: null })

  useEffect(() => {
    const root = document.documentElement
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    root.dataset.motion = reduced ? 'gentle' : 'full'
    const fail = (msg: string) => { setWhy(msg); setMode('none'); root.dataset.space = 'none' }
    if (!canvas.current || !hasWebGL()) { fail('Your browser could not start WebGL, so the 3D flight is switched off.'); return }
    root.dataset.space = 'live'
    // Quality tier only. Phones get the same 3D scene with lighter settings.
    const mobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768
    const sections = () => stops.map((s) => document.getElementById(`stop-${s.id}`)).filter(Boolean) as HTMLElement[]
    let tops: number[] = []
    const measure = () => { tops = sections().map((el) => el.getBoundingClientRect().top + window.scrollY) }
    measure()
    // Fractional stop index; past the last stop it keeps growing so HUD panels fade out.
    const getProgress = () => {
      const y = window.scrollY, n = tops.length
      if (!n || y <= tops[0]) return 0
      for (let i = 0; i < n - 1; i++) if (y < tops[i + 1]) return i + (y - tops[i]) / Math.max(1, tops[i + 1] - tops[i])
      return n - 1 + (y - tops[n - 1]) / window.innerHeight
    }
    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-stop-card]'))
    let lastIdx = -1
    const onFrame = ({ f, speed }: { f: number; speed: number }) => {
      const raw = getProgress()
      cards.forEach((c, i) => {
        const d = Math.abs(raw - i), o = Math.max(0, Math.min(1, 1 - (d - 0.08) / 0.26))
        c.style.opacity = String(o)
        c.style.setProperty('--in', String(o))
        c.style.pointerEvents = o > 0.5 ? 'auto' : 'none'
        c.setAttribute('aria-hidden', o > 0.5 ? 'false' : 'true')
      })
      const idx = Math.min(stops.length - 1, Math.round(f))
      const h = hud.current
      if (idx !== lastIdx && h.sector && h.name) { lastIdx = idx; h.sector.textContent = `SECTOR 0${idx + 1}/0${stops.length}`; h.name.textContent = stops[idx].title.toUpperCase() }
      if (h.vel) h.vel.textContent = (speed * 0.99).toFixed(2) + 'c'
      if (h.bar) h.bar.style.transform = `scaleX(${Math.min(1, f / (stops.length - 1))})`
      root.style.setProperty('--warp', speed.toFixed(3))
      if (canvas.current) canvas.current.style.opacity = String(raw > stops.length - 0.6 ? 0.45 : 1)
      root.classList.toggle('past-flight', raw > stops.length - 0.6)
    }
    window.addEventListener('resize', measure); window.addEventListener('load', measure)
    const mt = window.setInterval(measure, 1500)

    // Gyro look-around on phones. iOS needs a permission request from a tap.
    const DOE = (window as unknown as { DeviceOrientationEvent?: { requestPermission?: () => Promise<string> } }).DeviceOrientationEvent
    const needsAsk = mobile && !!DOE && typeof DOE.requestPermission === 'function'
    let asked = false
    const ask = () => {
      if (asked || !DOE?.requestPermission) return; asked = true
      DOE.requestPermission().catch(() => 'denied').finally(() => setGyroAsk(false))
    }
    if (needsAsk) { setGyroAsk(true); window.addEventListener('touchend', ask, { once: true }); window.addEventListener('click', ask, { once: true }) }

    const safety = window.setTimeout(() => setMode((m) => (m === 'loading' ? 'live' : m)), 15000)
    let dispose: (() => void) | undefined, dead = false
    import('../lib/spaceScene').then(({ startScene }) => {
      if (dead || !canvas.current) return
      try {
        dispose = startScene({
          canvas: canvas.current, mobile, reduced, stopCount: stops.length, getProgress, onFrame,
          onReady: () => setMode('live'),
          onLost: () => fail('The graphics context was lost, so the 3D flight stopped. Reload the page to try again.'),
        })
      } catch (e) { console.warn('3D scene failed to start', e); fail('The 3D scene could not start on this device.') }
    }).catch((e) => { console.warn('3D module failed to load', e); fail('The 3D scene could not be loaded. Reload the page to try again.') })
    return () => {
      dead = true; dispose?.(); window.clearTimeout(safety); window.clearInterval(mt)
      window.removeEventListener('resize', measure); window.removeEventListener('load', measure)
      window.removeEventListener('touchend', ask); window.removeEventListener('click', ask)
    }
  }, [])

  const go = (id: string) => document.getElementById(`stop-${id}`)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <canvas ref={canvas} className="space-canvas" aria-hidden="true" />
      {mode !== 'none' && (
        <div className="hud" aria-hidden="true">
          <div className="hud-reticle"><span /><span /><span /><span /></div>
          <div className="hud-tl">
            <p className="hud-dim">CF-LLC // NAV</p>
            <p ref={(el) => { hud.current.sector = el }}>SECTOR 01/0{stops.length}</p>
            <p ref={(el) => { hud.current.name = el }} className="hud-strong">{stops[0].title.toUpperCase()}</p>
          </div>
          <div className="hud-tr">
            <p className="hud-dim">VELOCITY</p>
            <p ref={(el) => { hud.current.vel = el }} className="hud-strong">0.00c</p>
          </div>
          <div className="hud-progress"><i ref={(el) => { hud.current.bar = el }} /></div>
          <p className="hud-hint">{gyroAsk ? 'Tap to enable tilt-look · swipe to fly' : 'Scroll to fly · move to look around'}</p>
        </div>
      )}
      {mode !== 'none' && (
        <nav className="hud-dots" aria-label="Flight stops">
          {stops.map((s, i) => <button key={s.id} type="button" onClick={() => go(s.id)} aria-label={`Fly to ${s.title}`}><span>0{i + 1}</span></button>)}
        </nav>
      )}
      {mode === 'none' && <p className="space-note" role="status">{why} You are seeing the flat version of the site.</p>}
      <div className={`space-loader ${mode === 'loading' ? '' : 'is-done'}`} aria-hidden="true">
        <div className="space-loader-ring" />
        <p>Igniting engines…</p>
      </div>
    </>
  )
}
