'use client'

import { useEffect, useRef, useState } from 'react'
import { stops } from '../data/stations'

function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')) } catch { return false }
}

// Full-screen WebGL hero. three is bundled from npm (separate chunk, fetched immediately, not idle-loaded).
export default function SpaceFlight() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [state, setState] = useState<'loading' | 'live' | 'static' | 'none'>('loading')

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.documentElement
    if (!hasWebGL() || !canvas.current) { setState('none'); root.dataset.space = 'none'; return }
    root.dataset.space = reduced ? 'static' : 'live'
    const mobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches
    const flight = () => document.getElementById('flight')
    const getProgress = () => {
      const f = flight(); if (!f) return 0
      const top = f.getBoundingClientRect().top + window.scrollY
      const range = f.offsetHeight - window.innerHeight
      return Math.min(1, Math.max(0, (window.scrollY - top) / Math.max(1, range)))
    }
    // Glass panels fade in as you arrive at each stop.
    const cards = () => Array.from(document.querySelectorAll<HTMLElement>('[data-stop-card]'))
    const fade = () => {
      const h = window.innerHeight
      for (const c of cards()) {
        const r = c.parentElement!.getBoundingClientRect()
        const d = Math.abs(r.top + r.height / 2 - h / 2) / h
        const o = Math.max(0, Math.min(1, 1.6 - d * 3.2))
        c.style.opacity = String(o); c.style.transform = `translateY(${(1 - o) * 40}px) scale(${0.96 + o * 0.04})`
      }
      const fade2 = 1 - Math.min(1, Math.max(0, (getProgress() - 0.985) * 60))
      if (canvas.current) canvas.current.style.opacity = String(0.35 + 0.65 * fade2)
    }
    if (!reduced) { window.addEventListener('scroll', fade, { passive: true }); fade() }
    let dispose: (() => void) | undefined, dead = false
    import('../lib/spaceScene').then(({ startScene }) => {
      if (dead || !canvas.current) return
      dispose = startScene({ canvas: canvas.current, mobile, reduced, stopCount: stops.length, getProgress, onReady: () => setState(reduced ? 'static' : 'live') })
    }).catch(() => { setState('none'); root.dataset.space = 'none' })
    return () => { dead = true; dispose?.(); window.removeEventListener('scroll', fade) }
  }, [])

  return (
    <>
      <canvas ref={canvas} className="space-canvas" aria-hidden="true" />
      <div className={`space-loader ${state === 'loading' ? '' : 'is-done'}`} aria-hidden="true">
        <div className="space-loader-ring" />
        <p>Igniting engines…</p>
      </div>
    </>
  )
}
