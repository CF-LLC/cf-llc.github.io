'use client'

/* eslint-disable @typescript-eslint/no-explicit-any -- untyped CDN globals (THREE) */
import { useEffect, useRef, useState } from 'react'
import data from '../data/ecosystem.json'

// Pinned CDN builds with Subresource Integrity, loaded in order.
// three r147 is the last release that ships the classic examples/js (global THREE.*) addons.
const CDN = 'https://cdn.jsdelivr.net/npm/three@0.147.0/'
const CORE = [
  ['build/three.min.js', 'sha384-vV17nr/rMaJqmeZkFUzXLpHdQ+ME5QHKdydaqqN+3Ga39RJlNrTatJxHwGV4ml2C'],
  ['examples/js/controls/OrbitControls.js', 'sha384-I0DMsfimAPIqWT8lF+oA997gRgdUi3jhidoTq3fN0zmn35smXZukD01FLnsPRU9i'],
]
const FX = [
  ['examples/js/shaders/CopyShader.js', 'sha384-jEqYdJwVhbnk5LMD7OzkM7Zn+m7ziM3b+VsGVfa/5BJobkk7Y0Gv8UWSFMs6lww0'],
  ['examples/js/shaders/LuminosityHighPassShader.js', 'sha384-pemnF+L/kioV52+hCxIKwYFCATMpS1eg1Jsq8tKbIwG9j4G3v6v1OpEuBnwFDfHe'],
  ['examples/js/postprocessing/EffectComposer.js', 'sha384-R0mna39OFXOi0vozEMV5F7tgsuOL4JYlJA1zMRSF/G36T6DdB9tLl4u4sGx195Te'],
  ['examples/js/postprocessing/ShaderPass.js', 'sha384-ZiGZOW8SNIUe2yogdaaTRbEdiEpMlAIx9hL5bw50EwSpa4fbthhT67TiAHlC9x5U'],
  ['examples/js/postprocessing/MaskPass.js', 'sha384-gIi7RFX7Tfx4uZNXqq8zYoylQ5Gfp1c5ttIgteXJoKbbvy9CGQ9ZWNjygulWgS/P'],
  ['examples/js/postprocessing/RenderPass.js', 'sha384-MvqV+yMfQqfT4GMD7NmeHbAcLhOaki0I2139ZAxe6+VyME2ys9TLRrRTsFtBJK21'],
  ['examples/js/postprocessing/UnrealBloomPass.js', 'sha384-EYOqTmLl8GhcXCeuHZ88cRp7inJaG/+pOg9hPG2GjQp535CVdHPNqMDbJMBbOypa'],
]

type Group = 'center' | 'public' | 'soon' | 'private'
type Node = { id: string; name: string; group: Group; url?: string; desc?: string; parent?: string }
type Status = 'checking' | 'up' | 'unknown' | 'down'

const COLORS: Record<Group, string> = { center: '#ffe9c7', public: '#4fd1e0', soon: '#f08a3c', private: '#c43b72' }

const nodes: Node[] = [{ id: data.center.id, name: data.center.name, group: 'center' }, ...(data.nodes as Node[])]
const links = (data.nodes as Node[]).map((n) => ({ source: n.parent || data.center.id, target: n.id }))

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch { return false }
}

function loadScript([path, sri]: string[]): Promise<void> {
  const src = CDN + path
  if (document.querySelector(`script[src="${src}"]`)) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = src; s.integrity = sri; s.crossOrigin = 'anonymous'; s.async = false
    s.onload = () => resolve(); s.onerror = () => reject(new Error('load failed: ' + path))
    document.head.appendChild(s)
  })
}
async function loadSeq(list: string[][]) { for (const f of list) await loadScript(f) }

// Best-effort reachability for PUBLIC nodes only (opaque no-cors fetch).
async function probe(url: string): Promise<Status> {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 6000)
  try { await fetch(url, { mode: 'no-cors', cache: 'no-store', signal: ctrl.signal }); return 'up' }
  catch (e: any) { return e?.name === 'AbortError' ? 'unknown' : 'down' }
  finally { clearTimeout(t) }
}

const STATUS_LABEL: Record<Status, string> = { checking: 'checking…', up: 'up', unknown: 'unknown', down: 'down' }
const STATUS_DOT: Record<Status, string> = { checking: '#6b6963', up: '#5fdf8f', unknown: '#9a978f', down: '#e4573f' }

function tag(n: Node) {
  return n.group === 'private' ? 'Private' : n.group === 'soon' ? 'Coming soon' : n.group === 'center' ? 'Core' : 'Public'
}

// Deterministic 3D layout: core at origin, top-level nodes on a ring, children orbit their parent.
function layout(): Record<string, [number, number, number]> {
  const pos: Record<string, [number, number, number]> = { [data.center.id]: [0, 0, 0] }
  const roots = nodes.filter((n) => n.group !== 'center' && !n.parent)
  // Interleave public and private worlds so the ring is balanced.
  const pubR = roots.filter((n) => n.group !== 'private'), privR = roots.filter((n) => n.group === 'private')
  const top: Node[] = []
  while (pubR.length || privR.length) { if (pubR.length) top.push(pubR.shift()!); if (privR.length) top.push(privR.shift()!) }
  const R = 72
  top.forEach((n, i) => {
    const a = (i / top.length) * Math.PI * 2 + 0.35
    const y = (n.group === 'private' ? -1 : 1) * (12 + (i % 2) * 10)
    pos[n.id] = [Math.cos(a) * R, y, Math.sin(a) * R]
  })
  const kids: Record<string, Node[]> = {}
  nodes.forEach((n) => { if (n.parent) (kids[n.parent] ||= []).push(n) })
  Object.entries(kids).forEach(([pid, list]) => {
    const [px, py, pz] = pos[pid]
    const base = Math.atan2(pz, px)
    list.forEach((k, j) => {
      const a = base + (j - (list.length - 1) / 2) * 0.8
      pos[k.id] = [px + Math.cos(a) * 32, py + 10 - j * 12, pz + Math.sin(a) * 32]
    })
  })
  return pos
}

function radial(T: any, stops: [number, string][], size = 128) {
  const c = document.createElement('canvas'); c.width = c.height = size
  const g = c.getContext('2d')!
  const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  stops.forEach(([o, col]) => gr.addColorStop(o, col))
  g.fillStyle = gr; g.fillRect(0, 0, size, size)
  return new T.CanvasTexture(c)
}

function labelSprite(T: any, n: Node, mobile: boolean) {
  const k2 = 2
  const c = document.createElement('canvas'); c.width = 512 * k2; c.height = 128 * k2
  const g = c.getContext('2d')!; g.scale(k2, k2)
  const priv = n.group === 'private'
  g.textAlign = 'center'; g.textBaseline = 'middle'
  g.shadowColor = 'rgba(0,0,0,0.9)'; g.shadowBlur = 8
  g.font = `${n.group === 'center' ? 600 : 500} ${n.group === 'center' ? 44 : 30}px Inter, system-ui, sans-serif`
  g.fillStyle = priv ? 'rgba(236,234,228,0.85)' : '#f4f2ec'
  g.fillText(n.name, 256, 52)
  g.font = '600 17px Inter, system-ui, sans-serif'
  g.fillStyle = COLORS[n.group]
  const sub = tag(n).toUpperCase().split('').join(' ')
  const w = g.measureText(sub).width
  if (priv) {
    const x = 256 - w / 2 - 18, y = 92
    g.strokeStyle = COLORS.private; g.lineWidth = 2.2
    g.beginPath(); g.arc(x, y - 5, 5, Math.PI, 0); g.stroke()
    g.fillRect(x - 7, y - 5, 14, 11)
  }
  if (n.group !== 'center') g.fillText(sub, 256, 92)
  const tex = new T.CanvasTexture(c); tex.minFilter = T.LinearFilter
  const s = new T.Sprite(new T.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }))
  const k = mobile ? 1.6 : 1
  s.scale.set(38 * k, 9.5 * k, 1)
  return s
}

const ATMO_VS = `varying vec3 vN; varying vec3 vV;
void main(){ vec4 mv = modelViewMatrix*vec4(position,1.0); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`
const ATMO_FS = `uniform vec3 uColor; uniform float uPower; uniform float uOpacity; varying vec3 vN; varying vec3 vV;
void main(){ float f = pow(1.0 - abs(dot(vN, vV)), uPower); gl_FragColor = vec4(uColor, f*uOpacity); }`

function buildScene(el: HTMLDivElement, fx: boolean, onSelect: (n: Node | null) => void) {
  const T = (window as any).THREE
  const mobile = window.matchMedia('(max-width: 640px), (pointer: coarse)').matches
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const W = () => el.clientWidth, H = () => el.clientHeight

  const renderer = new T.WebGLRenderer({ antialias: !mobile, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setSize(W(), H())
  renderer.setClearColor(0x030306, 1)
  renderer.domElement.style.display = 'block'
  el.appendChild(renderer.domElement)

  const scene = new T.Scene()
  scene.fog = new T.FogExp2(0x030306, 0.0028)
  const camera = new T.PerspectiveCamera(mobile ? 62 : 50, W() / H(), 0.1, 3000)
  const home = new T.Vector3(0, mobile ? 245 : 92, mobile ? 200 : 178)
  const homeTarget = new T.Vector3(0, mobile ? -40 : -14, 0)
  camera.position.set(0, 260, 760)

  const controls = new T.OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true; controls.dampingFactor = 0.07
  controls.enablePan = false; controls.minDistance = 40; controls.maxDistance = 420
  controls.rotateSpeed = mobile ? 0.6 : 0.8; controls.zoomSpeed = 0.8
  controls.target.copy(homeTarget); controls.autoRotate = !reduced; controls.autoRotateSpeed = 0.55

  scene.add(new T.AmbientLight(0x404058, 0.9))
  scene.add(new T.PointLight(0xffe2b0, 2.2, 600, 1.2))
  const rim = new T.DirectionalLight(0x6fbfff, 0.5); rim.position.set(-1, 1, -1); scene.add(rim)

  // Deep-space starfield
  const starCount = mobile ? 1100 : 3600
  const sp = new Float32Array(starCount * 3), sc = new Float32Array(starCount * 3)
  const tints = ['#ffffff', '#9fdcff', '#ffd2e6', '#ffe0b8'].map((c) => new T.Color(c))
  for (let i = 0; i < starCount; i++) {
    const r = 500 + Math.random() * 900, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1)
    sp.set([r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th)], i * 3)
    const c = tints[(Math.random() * tints.length) | 0].clone().multiplyScalar(0.5 + Math.random() * 0.5)
    sc.set([c.r, c.g, c.b], i * 3)
  }
  const sg = new T.BufferGeometry()
  sg.setAttribute('position', new T.BufferAttribute(sp, 3)); sg.setAttribute('color', new T.BufferAttribute(sc, 3))
  const starTex = radial(T, [[0, 'rgba(255,255,255,1)'], [0.3, 'rgba(255,255,255,0.5)'], [1, 'rgba(255,255,255,0)']], 64)
  const stars = new T.Points(sg, new T.PointsMaterial({ size: mobile ? 3.2 : 2.6, map: starTex, vertexColors: true, transparent: true, depthWrite: false, blending: T.AdditiveBlending, fog: false }))
  scene.add(stars)

  // Nebula clouds
  const nebula = new T.Group(); scene.add(nebula)
  const nebCols = ['rgba(196,59,114,', 'rgba(74,168,184,', 'rgba(197,106,43,', 'rgba(110,80,200,']
  const nebN = mobile ? 6 : 12
  for (let i = 0; i < nebN; i++) {
    const col = nebCols[i % nebCols.length]
    const tex = radial(T, [[0, col + '0.55)'], [0.4, col + '0.18)'], [1, col + '0)']], 256)
    const s = new T.Sprite(new T.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, blending: T.AdditiveBlending, opacity: 0.32, fog: false }))
    const a = (i / nebN) * Math.PI * 2, rr = 380 + (i % 3) * 120
    s.position.set(Math.cos(a) * rr, (Math.random() - 0.5) * 300, Math.sin(a) * rr)
    const sz = 420 + Math.random() * 380; s.scale.set(sz, sz, 1)
    nebula.add(s)
  }

  // Worlds
  const pos = layout()
  const glowTex = radial(T, [[0, 'rgba(255,255,255,0.9)'], [0.25, 'rgba(255,255,255,0.35)'], [1, 'rgba(255,255,255,0)']], 128)
  const seg = mobile ? 24 : 40
  const glowOp = (g: Group) => (g === 'center' ? 0.6 : g === 'private' ? 0.18 : 0.42)
  type NObj = { node: Node; group: any; core: any; glow: any; label: any; base: number }
  const objs: Record<string, NObj> = {}
  const pickables: any[] = []
  nodes.forEach((n) => {
    const g = new T.Group(); g.position.set(...pos[n.id]); scene.add(g)
    const col = new T.Color(COLORS[n.group])
    const r = n.group === 'center' ? 10 : n.parent ? 3.6 : 5.6
    let mat
    if (n.group === 'center') mat = new T.MeshBasicMaterial({ color: new T.Color('#ffe2b8') })
    else if (n.group === 'private') mat = new T.MeshStandardMaterial({ color: 0x2a1622, emissive: col, emissiveIntensity: 0.18, roughness: 0.35, metalness: 0.1, transparent: true, opacity: 0.78 })
    else mat = new T.MeshStandardMaterial({ color: col.clone().multiplyScalar(0.35), emissive: col, emissiveIntensity: n.group === 'soon' ? 0.55 : 0.9, roughness: 0.45, metalness: 0.2 })
    const core = new T.Mesh(new T.SphereGeometry(r, seg, seg), mat); g.add(core)
    g.add(new T.Mesh(new T.SphereGeometry(r * 1.35, seg, seg), new T.ShaderMaterial({
      vertexShader: ATMO_VS, fragmentShader: ATMO_FS, side: T.BackSide, transparent: true, depthWrite: false, blending: T.AdditiveBlending,
      uniforms: { uColor: { value: n.group === 'center' ? new T.Color('#ffb46b') : col }, uPower: { value: n.group === 'private' ? 3.0 : 2.0 }, uOpacity: { value: n.group === 'private' ? 0.45 : 1.0 } },
    })))
    const glow = new T.Sprite(new T.SpriteMaterial({ map: glowTex, color: n.group === 'center' ? new T.Color('#ffcf8a') : col, transparent: true, depthWrite: false, blending: T.AdditiveBlending, opacity: glowOp(n.group) }))
    const gs = r * (n.group === 'center' ? 5.5 : 4); glow.scale.set(gs, gs, 1); g.add(glow)
    if (n.group === 'private') {
      const ring = new T.Mesh(new T.TorusGeometry(r * 1.55, 0.25, 8, 48), new T.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.35 }))
      ring.rotation.x = Math.PI / 2.4; g.add(ring)
    }
    const label = labelSprite(T, n, mobile); label.position.set(0, r + (n.group === 'center' ? 8 : 6), 0); g.add(label)
    core.userData.id = n.id; pickables.push(core)
    objs[n.id] = { node: n, group: g, core, glow, label, base: 1 }
  })

  // Links with flowing light pulses
  const linkObjs: { a: string; b: string; line: any; curve: any; pulses: any[]; op: number }[] = []
  const pulseTex = radial(T, [[0, 'rgba(255,255,255,1)'], [0.35, 'rgba(255,255,255,0.4)'], [1, 'rgba(255,255,255,0)']], 64)
  links.forEach((l, i) => {
    const A = new T.Vector3(...pos[l.source]), B = new T.Vector3(...pos[l.target])
    const mid = A.clone().add(B).multiplyScalar(0.5); mid.y += A.distanceTo(B) * 0.18
    const curve = new T.QuadraticBezierCurve3(A, mid, B)
    const tgt = objs[l.target].node
    const col = new T.Color(COLORS[tgt.group])
    const op = tgt.group === 'private' ? 0.16 : 0.34
    const line = new T.Line(new T.BufferGeometry().setFromPoints(curve.getPoints(40)), new T.LineBasicMaterial({ color: col, transparent: true, opacity: op, blending: T.AdditiveBlending, depthWrite: false }))
    scene.add(line)
    const pulses: any[] = []
    const np = reduced || tgt.group === 'private' ? 0 : mobile ? 1 : 2
    for (let k = 0; k < np; k++) {
      const s = new T.Sprite(new T.SpriteMaterial({ map: pulseTex, color: col.clone().lerp(new T.Color('#ffffff'), 0.4), transparent: true, depthWrite: false, blending: T.AdditiveBlending }))
      s.scale.set(4.5, 4.5, 1); s.userData.off = k / np + i * 0.137; scene.add(s); pulses.push(s)
    }
    linkObjs.push({ a: l.source, b: l.target, line, curve, pulses, op })
  })
  const neighbors: Record<string, Set<string>> = {}
  links.forEach((l) => { (neighbors[l.source] ||= new Set()).add(l.target); (neighbors[l.target] ||= new Set()).add(l.source) })

  // Bloom (lighter on phones)
  let composer: any = null
  if (fx && T.EffectComposer && T.UnrealBloomPass) {
    composer = new T.EffectComposer(renderer)
    composer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2))
    composer.setSize(W(), H())
    composer.addPass(new T.RenderPass(scene, camera))
    const bs = mobile ? 0.5 : 1
    composer.addPass(new T.UnrealBloomPass(new T.Vector2(W() * bs, H() * bs), mobile ? 0.55 : 0.7, 0.45, 0.3))
  }

  // Interaction
  const ray = new T.Raycaster(); const ptr = new T.Vector2()
  let hovered: string | null = null
  let focus: { pos: any; tgt: any } | null = null
  let intro: { t0: number; from: any } | null = reduced ? null : { t0: performance.now(), from: camera.position.clone() }
  if (reduced) camera.position.copy(home)
  let idleTimer: any
  const pauseOrbit = () => {
    controls.autoRotate = false; clearTimeout(idleTimer)
    if (!reduced) idleTimer = setTimeout(() => { if (!focus) controls.autoRotate = true }, 7000)
  }
  controls.addEventListener('start', () => { pauseOrbit(); focus = null; intro = null })

  const pick = (e: PointerEvent) => {
    const r = renderer.domElement.getBoundingClientRect()
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(ptr, camera)
    const hit = ray.intersectObjects(pickables, false)[0]
    return hit ? (hit.object.userData.id as string) : null
  }
  const highlight = (id: string | null) => {
    const set = id ? new Set([id, ...Array.from(neighbors[id] || [])]) : null
    Object.values(objs).forEach((o) => {
      const on = !set || set.has(o.node.id)
      o.label.material.opacity = on ? 1 : 0.18
      o.glow.material.opacity = (on ? 1 : 0.25) * glowOp(o.node.group)
      o.base = id === o.node.id ? 1.35 : 1
    })
    linkObjs.forEach((L) => {
      const on = !id || L.a === id || L.b === id
      L.line.material.opacity = on ? (id ? 0.85 : L.op) : 0.05
    })
  }
  const flyTo = (id: string | null) => {
    pauseOrbit(); intro = null
    if (!id) { focus = { pos: home.clone(), tgt: homeTarget.clone() }; highlight(null); return }
    const p = objs[id].group.position.clone()
    const dir = p.clone().sub(camera.position).normalize()
    const dist = id === data.center.id ? (mobile ? 220 : 170) : mobile ? 70 : 52
    focus = { pos: p.clone().sub(dir.multiplyScalar(dist)).add(new T.Vector3(0, 10, 0)), tgt: p }
    highlight(id)
  }
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return
    const id = pick(e)
    if (id !== hovered) { hovered = id; highlight(id); renderer.domElement.style.cursor = id ? 'pointer' : 'grab' }
  }
  let downAt = { x: 0, y: 0 }
  const onDown = (e: PointerEvent) => { downAt = { x: e.clientX, y: e.clientY } }
  const onUp = (e: PointerEvent) => {
    if (Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 6) return
    const id = pick(e)
    flyTo(id)
    onSelect(id ? nodes.find((n) => n.id === id) || null : null)
  }
  const cv = renderer.domElement
  cv.addEventListener('pointermove', onMove); cv.addEventListener('pointerdown', onDown); cv.addEventListener('pointerup', onUp)

  const ro = new ResizeObserver(() => {
    camera.aspect = W() / H(); camera.updateProjectionMatrix(); renderer.setSize(W(), H()); composer?.setSize(W(), H())
  })
  ro.observe(el)
  let visible = true
  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting })
  io.observe(el)

  const ease = (t: number) => 1 - Math.pow(1 - t, 3)
  const clock = new T.Clock()
  let raf = 0
  const loop = () => {
    raf = requestAnimationFrame(loop)
    if (!visible || document.hidden) return
    const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime
    if (intro) {
      const k = Math.min((performance.now() - intro.t0) / 3200, 1)
      camera.position.lerpVectors(intro.from, home, ease(k))
      if (k >= 1) intro = null
    } else if (focus) {
      camera.position.lerp(focus.pos, 0.06); controls.target.lerp(focus.tgt, 0.08)
      if (camera.position.distanceTo(focus.pos) < 0.5) focus = null
    }
    Object.values(objs).forEach((o, i) => {
      if (reduced) { o.group.scale.setScalar(o.base); return }
      const beat = o.node.group === 'center' ? 1 + Math.sin(t * 1.6) * 0.04 : 1
      o.group.scale.setScalar(o.group.scale.x + (o.base * beat - o.group.scale.x) * 0.15)
      o.core.rotation.y += dt * 0.2
      o.group.position.y = pos[o.node.id][1] + (o.node.group === 'center' ? 0 : Math.sin(t * 0.6 + i) * 1.2)
    })
    if (!reduced) {
      linkObjs.forEach((L) => L.pulses.forEach((s) => {
        const u = (t * 0.28 + s.userData.off) % 1
        s.position.copy(L.curve.getPoint(u)); s.material.opacity = Math.sin(u * Math.PI)
      }))
      stars.rotation.y += dt * 0.004; nebula.rotation.y -= dt * 0.006
    }
    controls.update()
    if (composer) composer.render(); else renderer.render(scene, camera)
  }
  loop()

  const dispose = () => {
    cancelAnimationFrame(raf); clearTimeout(idleTimer); ro.disconnect(); io.disconnect(); controls.dispose()
    cv.removeEventListener('pointermove', onMove); cv.removeEventListener('pointerdown', onDown); cv.removeEventListener('pointerup', onUp)
    scene.traverse((o: any) => { o.geometry?.dispose?.(); const m = o.material; if (m) { m.map?.dispose?.(); m.dispose?.() } })
    composer?.dispose?.(); renderer.dispose(); cv.remove()
  }
  return { dispose, flyTo }
}

const GRAD = 'bg-gradient-to-r from-[#ffe9c7] via-[#ff8fbf] to-[#4fd1e0] bg-clip-text text-transparent'
const LEGEND: [Group, string][] = [['public', 'Public site'], ['soon', 'Coming soon'], ['private', 'Private']]

export default function EcosystemGraph() {
  const box = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<'loading' | '3d' | 'list'>('loading')
  const [selected, setSelected] = useState<Node | null>(null)
  const [status, setStatus] = useState<Record<string, Status>>({})
  const flyRef = useRef<(id: string | null) => void>(() => {})

  useEffect(() => {
    const pub = nodes.filter((n) => n.group === 'public' && n.url)
    const origins = Array.from(new Set(pub.map((n) => new URL(n.url!).origin)))
    setStatus(Object.fromEntries(pub.map((n) => [n.id, 'checking' as Status])))
    origins.forEach(async (o) => {
      const s = await probe(o + '/')
      setStatus((prev) => { const next = { ...prev }; pub.forEach((n) => { if (new URL(n.url!).origin === o) next[n.id] = s }); return next })
    })
  }, [])

  useEffect(() => {
    if (!hasWebGL()) { setMode('list'); return }
    let cancelled = false
    let dispose = () => {}
    ;(async () => {
      try { await loadSeq(CORE) } catch { if (!cancelled) setMode('list'); return }
      let fx = true
      try { await loadSeq(FX) } catch { fx = false }
      if (cancelled || !box.current) return
      try {
        const s = buildScene(box.current, fx, setSelected)
        dispose = s.dispose; flyRef.current = s.flyTo
        setMode('3d')
      } catch { setMode('list') }
    })()
    return () => { cancelled = true; dispose() }
  }, [])

  const dot = (id: string) => {
    const s = status[id]
    if (!s) return null
    return (
      <span className="ml-2 inline-flex items-center gap-1 align-middle text-xs font-normal text-white/55" title={`Status: ${STATUS_LABEL[s]}`}>
        <span className="inline-block h-2 w-2 rounded-full" style={{ background: STATUS_DOT[s], boxShadow: s === 'up' ? `0 0 8px ${STATUS_DOT[s]}` : undefined }} />
        {STATUS_LABEL[s]}
      </span>
    )
  }
  const close = () => { setSelected(null); flyRef.current(null) }

  return (
    <section aria-label="Ecosystem map">
      {mode !== 'list' && (
        <div className="relative -mx-5 overflow-hidden border-y border-white/10 bg-[#030306] sm:mx-0 sm:rounded-2xl sm:border">
          <div ref={box} className="h-[78vh] min-h-[460px] w-full touch-none select-none sm:h-[80vh]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-[#030306]/90 via-[#030306]/40 to-transparent px-5 pb-16 pt-6 sm:px-8 sm:pt-8">
            <p className="kicker text-[0.65rem] sm:text-xs">Cooper Featherstone LLC</p>
            <h1 className={`display-title mt-2 text-5xl sm:text-7xl ${GRAD}`}>My Ecosystem</h1>
            <p className="mt-2 max-w-md text-sm text-white/65">Everything I build and run, in one universe. Drag to orbit, pinch or scroll to zoom, tap a world.</p>
          </div>
          <div className="pointer-events-none absolute bottom-4 right-4 flex flex-col gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] text-white/70 backdrop-blur-md">
            {LEGEND.map(([g, label]) => (
              <span key={g} className="inline-flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full" style={{ background: COLORS[g], boxShadow: `0 0 8px ${COLORS[g]}` }} />
                {label}
              </span>
            ))}
          </div>
          {mode === 'loading' && <p className="absolute inset-0 grid place-items-center text-sm tracking-[0.3em] text-white/50">LOADING UNIVERSE…</p>}
          {selected && (
            <div className="absolute bottom-4 left-4 right-4 max-w-sm rounded-2xl border border-white/15 bg-white/[0.06] p-5 backdrop-blur-xl sm:right-auto sm:w-80" style={{ boxShadow: `0 0 0 1px ${COLORS[selected.group]}33, 0 10px 50px ${COLORS[selected.group]}22` }}>
              <p className="text-[11px] uppercase tracking-[0.25em]" style={{ color: COLORS[selected.group] }}>{selected.group === 'private' ? '🔒 ' : ''}{tag(selected)}</p>
              <p className="mt-1 text-xl font-semibold text-white">{selected.name}{dot(selected.id)}</p>
              {selected.desc && <p className="mt-1 text-sm text-white/70">{selected.desc}</p>}
              {selected.group === 'public' && selected.url ? (
                <a href={selected.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block rounded-full bg-gradient-to-r from-[#ffe9c7] to-[#4fd1e0] px-5 py-2 text-sm font-semibold text-[#070708] hover:brightness-110">Open site ↗</a>
              ) : selected.group === 'private' ? (
                <p className="mt-2 text-sm text-white/55">Private tool, not publicly accessible.</p>
              ) : selected.group === 'soon' ? (
                <p className="mt-2 text-sm text-white/55">Launching soon.</p>
              ) : null}
              <button onClick={close} className="absolute right-4 top-3 text-lg text-white/60 hover:text-white" aria-label="Close">×</button>
            </div>
          )}
        </div>
      )}
      {mode === 'list' && (
        <div className="py-6">
          <p className="kicker">Cooper Featherstone LLC</p>
          <h1 className={`display-title mt-3 text-5xl sm:text-6xl ${GRAD}`}>My Ecosystem</h1>
          <p className="mt-3 text-sm text-white/60">The 3D view isn’t available on this device, so here’s the list view.</p>
        </div>
      )}

      <h2 className="display-title mt-12 text-3xl text-white">All properties</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {nodes.filter((n) => n.group !== 'center').map((n) => (
          <li key={n.id} className="glass rounded-xl p-4">
            <p className="text-xs uppercase tracking-[0.2em]" style={{ color: COLORS[n.group] }}>{n.group === 'private' ? '🔒 ' : ''}{tag(n)}</p>
            <p className="mt-1 font-semibold text-white">
              {n.group === 'public' && n.url
                ? <a href={n.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-white">{n.name}</a>
                : n.name}
              {dot(n.id)}
            </p>
            {n.desc && <p className="mt-1 text-sm text-white/65">{n.desc}</p>}
          </li>
        ))}
      </ul>
    </section>
  )
}
