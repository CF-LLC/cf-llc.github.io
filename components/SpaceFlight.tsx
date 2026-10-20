'use client'

/* eslint-disable @typescript-eslint/no-explicit-any -- untyped CDN global (THREE) */
import { useEffect, useRef } from 'react'
import { stations } from '../data/stations'

// Same pinned three build as /ecosystem (r147, SRI). Loaded lazily after first paint, never blocks content.
const THREE_SRC = 'https://cdn.jsdelivr.net/npm/three@0.147.0/build/three.min.js'
const THREE_SRI = 'sha384-vV17nr/rMaJqmeZkFUzXLpHdQ+ME5QHKdydaqqN+3Ga39RJlNrTatJxHwGV4ml2C'
export const GAP = 70 // world units between stops

function loadThree(): Promise<any> {
  const w = window as any
  if (w.THREE) return Promise.resolve(w.THREE)
  return new Promise((res, rej) => {
    const s = document.createElement('script')
    s.src = THREE_SRC; s.integrity = THREE_SRI; s.crossOrigin = 'anonymous'; s.async = true
    s.onload = () => res(w.THREE); s.onerror = rej
    document.head.appendChild(s)
  })
}

function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')) } catch { return false }
}

// Seeded RNG so planets look the same on every visit.
function rng(seed: number) { return () => ((seed = (seed * 16807) % 2147483647) / 2147483647) }

function planetTexture(T: any, base: string, accent: string, seed: number, banded: boolean, size: number) {
  const c = document.createElement('canvas'); c.width = size; c.height = size / 2
  const g = c.getContext('2d')!; const r = rng(seed * 9973 + 7)
  g.fillStyle = base; g.fillRect(0, 0, c.width, c.height)
  if (banded) {
    for (let y = 0; y < c.height; y += 2 + r() * 10) {
      g.globalAlpha = 0.15 + r() * 0.35; g.fillStyle = r() > 0.5 ? accent : '#000'
      g.fillRect(0, y, c.width, 1 + r() * 8)
    }
  } else {
    for (let i = 0; i < 160; i++) {
      const x = r() * c.width, y = r() * c.height, rad = 4 + r() * size / 10
      const gr = g.createRadialGradient(x, y, 0, x, y, rad)
      const col = r() > 0.55 ? accent : r() > 0.5 ? '#ffffff' : '#000000'
      gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)')
      g.globalAlpha = 0.12 + r() * 0.25; g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2)
    }
  }
  g.globalAlpha = 1
  const t = new T.CanvasTexture(c); t.anisotropy = 4; return t
}

function glowTexture(T: any, color: string) {
  const c = document.createElement('canvas'); c.width = c.height = 128
  const g = c.getContext('2d')!; const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  gr.addColorStop(0, color); gr.addColorStop(0.35, color + '55'); gr.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128)
  return new T.CanvasTexture(c)
}

export default function SpaceFlight() {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = host.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !hasWebGL()) { document.documentElement.dataset.space = 'static'; return }
    let stop = () => {}
    let cancelled = false

    const start = () => loadThree().then((T) => {
      if (cancelled || !T) return
      const mobile = window.innerWidth < 768 || matchMedia('(pointer: coarse)').matches
      const renderer = new T.WebGLRenderer({ antialias: !mobile, alpha: false, powerPreference: 'high-performance' })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 2))
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0x05040a)
      renderer.domElement.setAttribute('aria-hidden', 'true')
      el.appendChild(renderer.domElement)

      const scene = new T.Scene()
      scene.fog = new T.FogExp2(0x05040a, 0.0065)
      const camera = new T.PerspectiveCamera(mobile ? 70 : 58, window.innerWidth / window.innerHeight, 0.1, 900)
      scene.add(new T.AmbientLight(0x6b6890, 0.55))
      const sun = new T.DirectionalLight(0xfff1dc, 1.35); sun.position.set(-30, 20, 30); scene.add(sun)

      const total = (stations.length + 1) * GAP
      // Stars: a long tube of points around the flight path.
      const count = mobile ? 1800 : 6000
      const pos = new Float32Array(count * 3); const col = new Float32Array(count * 3)
      const r = rng(42); const tint = [new T.Color('#ffffff'), new T.Color('#b9f3ff'), new T.Color('#ffd6f0'), new T.Color('#ffe9c7')]
      for (let i = 0; i < count; i++) {
        const a = r() * Math.PI * 2, d = 25 + r() * 160
        pos[i * 3] = Math.cos(a) * d; pos[i * 3 + 1] = Math.sin(a) * d * 0.7; pos[i * 3 + 2] = 40 - r() * (total + 200)
        const c = tint[Math.floor(r() * 4)]; col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
      }
      const sg = new T.BufferGeometry()
      sg.setAttribute('position', new T.BufferAttribute(pos, 3)); sg.setAttribute('color', new T.BufferAttribute(col, 3))
      const stars = new T.Points(sg, new T.PointsMaterial({ size: mobile ? 0.9 : 0.7, vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false }))
      scene.add(stars)

      // Nebula clouds.
      const neb = ['#c43b72', '#4aa8b8', '#7a4de0', '#e0823c']
      for (let i = 0; i < (mobile ? 6 : 12); i++) {
        const m = new T.SpriteMaterial({ map: glowTexture(T, neb[i % 4]), transparent: true, opacity: 0.22, depthWrite: false, blending: T.AdditiveBlending })
        const s = new T.Sprite(m); const k = 90 + r() * 120
        s.scale.set(k, k, 1); s.position.set((r() - 0.5) * 220, (r() - 0.5) * 120, -r() * total - 40); scene.add(s)
      }

      const spinners: any[] = []
      const side = mobile ? 2.6 : 11
      stations.forEach((st, i) => {
        const g = new T.Group(); const z = -(i + 1) * GAP
        g.position.set(i % 2 ? -side : side, mobile ? 3.5 : 0, z)
        const radius = st.kind === 'gas' ? 7 : st.kind === 'moon' ? 3.6 : 5.5
        if (st.kind === 'station') {
          const metal = new T.MeshStandardMaterial({ color: 0xd8dbe8, metalness: 0.75, roughness: 0.3 })
          const glow = new T.MeshBasicMaterial({ color: st.accent })
          const ring = new T.Mesh(new T.TorusGeometry(5.2, 0.55, 16, mobile ? 48 : 96), metal)
          const ring2 = new T.Mesh(new T.TorusGeometry(5.2, 0.12, 8, 96), glow); ring2.position.z = 0.6
          const hub = new T.Mesh(new T.CylinderGeometry(1.1, 1.1, 4, 24), metal); hub.rotation.x = Math.PI / 2
          const core = new T.Mesh(new T.SphereGeometry(0.9, 24, 16), glow); core.position.z = 2.2
          const spin = new T.Group(); spin.add(ring, ring2)
          for (let k = 0; k < 4; k++) { const sp = new T.Mesh(new T.BoxGeometry(0.25, 10, 0.25), metal); sp.rotation.z = (k * Math.PI) / 4; spin.add(sp) }
          const panel = new T.MeshStandardMaterial({ color: st.color, metalness: 0.4, roughness: 0.4, emissive: st.color, emissiveIntensity: 0.25 })
          for (const sx of [-1, 1]) { const p = new T.Mesh(new T.BoxGeometry(5, 1.6, 0.08), panel); p.position.set(sx * 9, 0, 0); spin.add(p) }
          g.add(spin, hub, core); spinners.push({ o: spin, s: 0.12 }); g.rotation.x = 0.35
        } else {
          const tex = planetTexture(T, st.color, st.accent, i + 1, st.kind === 'gas', mobile ? 256 : 512)
          const p = new T.Mesh(new T.SphereGeometry(radius, mobile ? 32 : 64, mobile ? 24 : 48), new T.MeshStandardMaterial({ map: tex, roughness: 0.85, metalness: 0.05 }))
          p.rotation.z = 0.35; g.add(p); spinners.push({ o: p, s: 0.05 + (i % 3) * 0.02, y: true })
          const atm = new T.Sprite(new T.SpriteMaterial({ map: glowTexture(T, st.accent), transparent: true, opacity: 0.55, depthWrite: false, blending: T.AdditiveBlending }))
          atm.scale.set(radius * 3.3, radius * 3.3, 1); g.add(atm)
          if (st.rings) {
            const rg = new T.Mesh(new T.RingGeometry(radius * 1.35, radius * 2.1, 96), new T.MeshBasicMaterial({ color: st.accent, side: T.DoubleSide, transparent: true, opacity: 0.35, depthWrite: false }))
            rg.rotation.x = Math.PI / 2.4; g.add(rg)
          }
        }
        scene.add(g)
      })

      // Scroll -> target camera z; the camera eases toward it so scrolling feels like flying.
      let target = 0, camZ = 18, mx = 0, my = 0, raf = 0, running = true
      // Each stop's card is centred on screen exactly when the camera sits in front of its planet.
      const VIEW = 26
      let keys: [number, number][] = []
      const measure = () => {
        keys = [[0, 18]]
        stations.forEach((st, i) => {
          const sec = document.getElementById(`stop-${st.id}`)
          if (!sec) return
          const y = sec.getBoundingClientRect().top + window.scrollY + sec.offsetHeight / 2 - window.innerHeight / 2
          keys.push([y, -(i + 1) * GAP + VIEW])
        })
        const max = document.documentElement.scrollHeight - window.innerHeight
        const last = keys[keys.length - 1]
        if (max > last[0]) keys.push([max, last[1] - GAP * 1.4])
      }
      const onScroll = () => {
        const y = window.scrollY
        if (!keys.length) measure()
        let z = keys[keys.length - 1][1]
        for (let k = 1; k < keys.length; k++) {
          if (y <= keys[k][0]) {
            const [y0, z0] = keys[k - 1], [y1, z1] = keys[k]
            const f = y1 > y0 ? (y - y0) / (y1 - y0) : 1
            const e = f * f * (3 - 2 * f) // ease so the ship slows at each stop
            z = z0 + (z1 - z0) * e; break
          }
        }
        target = z
      }
      const onMove = (e: PointerEvent) => { mx = e.clientX / window.innerWidth - 0.5; my = e.clientY / window.innerHeight - 0.5 }
      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight); measure(); onScroll()
      }
      const onVis = () => { running = !document.hidden; if (running) { raf = requestAnimationFrame(tick) } }
      const clock = new T.Clock()
      const tick = () => {
        if (!running) return
        const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime
        camZ += (target - camZ) * Math.min(1, dt * 3.2)
        camera.position.set(Math.sin(t * 0.15) * 1.2 + mx * 3, Math.cos(t * 0.12) * 0.8 - my * 2, camZ)
        camera.lookAt(mx * 2, -my, camZ - 30)
        for (const s of spinners) { if (s.y) s.o.rotation.y += dt * s.s; else s.o.rotation.z += dt * s.s }
        stars.rotation.z = t * 0.004
        renderer.render(scene, camera)
        raf = requestAnimationFrame(tick)
      }
      measure(); onScroll(); camZ = target
      setTimeout(() => { measure(); onScroll() }, 1500)
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onResize)
      window.addEventListener('pointermove', onMove, { passive: true })
      document.addEventListener('visibilitychange', onVis)
      document.documentElement.dataset.space = 'live'
      raf = requestAnimationFrame(tick)
      stop = () => {
        running = false; cancelAnimationFrame(raf)
        window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize)
        window.removeEventListener('pointermove', onMove); document.removeEventListener('visibilitychange', onVis)
        renderer.dispose(); renderer.domElement.remove()
      }
    }).catch(() => { document.documentElement.dataset.space = 'static' })

    const ric = (window as any).requestIdleCallback || ((f: () => void) => setTimeout(f, 200))
    ric(start)
    return () => { cancelled = true; stop() }
  }, [])

  return <div ref={host} className="space-canvas" aria-hidden="true" />
}
