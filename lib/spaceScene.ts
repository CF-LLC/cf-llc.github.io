/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unused-expressions */
// @ts-nocheck -- three is bundled from npm; scene code is plain imperative three.js
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

export type SceneOpts = { canvas: HTMLCanvasElement; mobile: boolean; reduced: boolean; stopCount: number; getProgress: () => number; onReady: () => void; onFrame?: (d: { f: number; speed: number; dpr: number }) => void; onLost?: () => void }
let ZLEN = 1100

// ---------- procedural textures ----------
function rng(seed) { return () => ((seed = (seed * 16807) % 2147483647) / 2147483647) }
function makeNoise(seed) {
  const r = rng(seed), P = new Uint8Array(512), G = []
  for (let i = 0; i < 256; i++) { P[i] = i; const a = r() * Math.PI * 2; G.push([Math.cos(a), Math.sin(a)]) }
  for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [P[i], P[j]] = [P[j], P[i]] }
  for (let i = 0; i < 256; i++) P[i + 256] = P[i]
  const f = (t) => t * t * t * (t * (t * 6 - 15) + 10)
  const g = (h, x, y) => { const v = G[h & 255]; return v[0] * x + v[1] * y }
  const n2 = (x, y) => {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255; x -= Math.floor(x); y -= Math.floor(y)
    const u = f(x), v = f(y), a = P[X] + Y, b = P[X + 1] + Y
    const l1 = g(P[a], x, y) + u * (g(P[b], x - 1, y) - g(P[a], x, y))
    const l2 = g(P[a + 1], x, y - 1) + u * (g(P[b + 1], x - 1, y - 1) - g(P[a + 1], x, y - 1))
    return l1 + v * (l2 - l1)
  }
  return (x, y, oct = 5) => { let s = 0, a = 0.5, fr = 1; for (let o = 0; o < oct; o++) { s += a * n2(x * fr, y * fr); a *= 0.5; fr *= 2 } return s }
}
const hex = (h) => { const c = new THREE.Color(h); return [c.r * 255, c.g * 255, c.b * 255] }
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
function ramp(stops, t) {
  t = Math.min(1, Math.max(0, t))
  for (let i = 1; i < stops.length; i++) if (t <= stops[i][0]) { const [t0, c0] = stops[i - 1], [t1, c1] = stops[i]; return mix(c0, c1, (t - t0) / (t1 - t0 || 1)) }
  return stops[stops.length - 1][1]
}
function planetTex(w, seed, kind, palette) {
  const h = w / 2, c = document.createElement('canvas'); c.width = w; c.height = h
  const ctx = c.getContext('2d'), img = ctx.createImageData(w, h), n = makeNoise(seed)
  const stops = palette.map(([t, col]) => [t, hex(col)])
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const lon = (x / w) * Math.PI * 2, lat = (y / h) * Math.PI
    const nx = Math.cos(lon) * Math.sin(lat), ny = Math.sin(lon) * Math.sin(lat), nz = Math.cos(lat)
    let v
    if (kind === 'gas') { const warp = n(nx * 2 + 3, ny * 2 + nz, 4) * 1.4; v = 0.5 + 0.5 * Math.sin(nz * 9 + warp * 3) * 0.8 + n(nx * 6, nz * 6 + ny, 3) * 0.3 }
    else if (kind === 'clouds') { v = n(nx * 3 + nz, ny * 3 - nz, 6) * 1.6 + 0.5 }
    else { v = n(nx * 1.6 + 5, ny * 1.6 + nz * 1.6, 6) * 1.3 + 0.5 }
    const col = ramp(stops, v), i = (y * w + x) * 4
    img.data[i] = col[0]; img.data[i + 1] = col[1]; img.data[i + 2] = col[2]
    img.data[i + 3] = kind === 'clouds' ? Math.max(0, Math.min(255, (v - 0.52) * 900)) : 255
  }
  ctx.putImageData(img, 0, 0)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t
}
function softDot(color, size = 128, hard = 0.0) {
  const c = document.createElement('canvas'); c.width = c.height = size
  const g = c.getContext('2d'), gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gr.addColorStop(0, color); gr.addColorStop(hard || 0.25, color + '88'); gr.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = gr; g.fillRect(0, 0, size, size)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t
}
function nebulaTex(seed, col) {
  const s = 256, c = document.createElement('canvas'); c.width = c.height = s
  const ctx = c.getContext('2d'), img = ctx.createImageData(s, s), n = makeNoise(seed), rgb = hex(col)
  for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) {
    const dx = x / s - 0.5, dy = y / s - 0.5, d = Math.sqrt(dx * dx + dy * dy) * 2
    const v = Math.max(0, n(x / 60, y / 60, 5) + 0.35) * Math.max(0, 1 - d) ** 1.6
    const i = (y * s + x) * 4; img.data[i] = rgb[0]; img.data[i + 1] = rgb[1]; img.data[i + 2] = rgb[2]; img.data[i + 3] = Math.min(255, v * 420)
  }
  ctx.putImageData(img, 0, 0); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t
}

// ---------- shaders ----------
function atmosphere(color, radius, power = 3.0, strength = 1.2) {
  const m = new THREE.ShaderMaterial({
    uniforms: { c: { value: new THREE.Color(color) }, p: { value: power }, s: { value: strength } },
    vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }',
    fragmentShader: 'uniform vec3 c; uniform float p; uniform float s; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0 - abs(dot(vN, vV)), p); gl_FragColor = vec4(c*f*s, f); }',
    blending: THREE.AdditiveBlending, side: THREE.BackSide, transparent: true, depthWrite: false,
  })
  return new THREE.Mesh(new THREE.SphereGeometry(radius * 1.18, 64, 48), m)
}
function starLayer(count, spread, near, size, seed, mobile) {
  const r = rng(seed), pos = new Float32Array(count * 3), col = new Float32Array(count * 3), ph = new Float32Array(count)
  const tints = ['#ffffff', '#b9f3ff', '#ffd6f0', '#ffe9c7', '#c9c4ff'].map((h) => new THREE.Color(h))
  for (let i = 0; i < count; i++) {
    const a = r() * Math.PI * 2, d = near + r() * spread
    pos[i * 3] = Math.cos(a) * d; pos[i * 3 + 1] = Math.sin(a) * d * 0.8; pos[i * 3 + 2] = 160 - r() * ZLEN
    const c = tints[Math.floor(r() * tints.length)]; col.set([c.r, c.g, c.b], i * 3); ph[i] = r() * 6.28
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.setAttribute('ph', new THREE.BufferAttribute(ph, 1))
  const m = new THREE.ShaderMaterial({
    uniforms: { t: { value: 0 }, size: { value: size * (mobile ? 1.4 : 1) }, px: { value: 1 } },
    vertexShader: 'attribute float ph; attribute vec3 color; varying vec3 vC; varying float vT; uniform float t; uniform float size; uniform float px; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); vC = color; vT = 0.65+0.35*sin(t*1.7+ph); gl_PointSize = size*px*(300.0/-mv.z); gl_Position = projectionMatrix*mv; }',
    fragmentShader: 'varying vec3 vC; varying float vT; void main(){ vec2 d = gl_PointCoord-0.5; float r = length(d); if(r>0.5) discard; float a = smoothstep(0.5,0.0,r); a = a*a; gl_FragColor = vec4(vC*vT*1.6, a); }',
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  })
  return new THREE.Points(g, m)
}

// ---------- builders ----------
function planet(o) {
  const g = new THREE.Group(), seg = o.mobile ? 48 : 96
  const body = new THREE.Mesh(new THREE.SphereGeometry(o.r, seg, seg / 2), new THREE.MeshStandardMaterial({ map: planetTex(o.mobile ? 512 : 1024, o.seed, o.kind, o.palette), roughness: 0.9, metalness: 0, emissive: new THREE.Color(o.glow), emissiveIntensity: 0.0 }))
  body.rotation.z = o.tilt || 0.3; g.add(body)
  let clouds = null
  if (o.clouds) { clouds = new THREE.Mesh(new THREE.SphereGeometry(o.r * 1.02, seg, seg / 2), new THREE.MeshStandardMaterial({ map: planetTex(o.mobile ? 512 : 1024, o.seed + 9, 'clouds', [[0, '#ffffff'], [1, '#ffffff']]), transparent: true, depthWrite: false })); g.add(clouds) }
  g.add(atmosphere(o.glow, o.r, 3.2, 0.9))
  if (o.rings) {
    const rc = document.createElement('canvas'); rc.width = 512; rc.height = 8; const x = rc.getContext('2d'), rr = rng(o.seed + 3)
    for (let i = 0; i < 512; i++) { x.fillStyle = `rgba(${o.rings.join(',')},${(0.15 + rr() * 0.7) * Math.sin((i / 512) * Math.PI)})`; x.fillRect(i, 0, 1, 8) }
    const tex = new THREE.CanvasTexture(rc); tex.colorSpace = THREE.SRGBColorSpace
    const geo = new THREE.RingGeometry(o.r * 1.4, o.r * 2.4, 160, 1), uv = geo.attributes.uv, p = geo.attributes.position, v = new THREE.Vector3()
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); uv.setXY(i, (v.length() - o.r * 1.4) / (o.r * 1.0), 0.5) }
    const ring = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, transparent: true, depthWrite: false }))
    ring.rotation.x = Math.PI / 2.3; ring.rotation.y = 0.25; g.add(ring)
  }
  g.userData = { body, clouds, spin: o.spin || 0.05, hover: 0, baseScale: 1 }
  return g
}
function station(o) {
  const g = new THREE.Group()
  const metal = new THREE.MeshStandardMaterial({ color: 0xc9cede, metalness: 0.85, roughness: 0.28 })
  const dark = new THREE.MeshStandardMaterial({ color: 0x23263a, metalness: 0.6, roughness: 0.5 })
  const glow = new THREE.MeshBasicMaterial({ color: new THREE.Color(o.accent).multiplyScalar(2.2) })
  const spin = new THREE.Group()
  spin.add(new THREE.Mesh(new THREE.TorusGeometry(o.r, o.r * 0.1, 24, o.mobile ? 64 : 160), metal))
  const strip = new THREE.Mesh(new THREE.TorusGeometry(o.r, o.r * 0.025, 8, 160), glow); strip.position.z = o.r * 0.1; spin.add(strip)
  for (let k = 0; k < 6; k++) { const s = new THREE.Mesh(new THREE.CylinderGeometry(o.r * 0.03, o.r * 0.03, o.r * 2, 8), dark); s.rotation.z = (k * Math.PI) / 6; spin.add(s) }
  for (let k = 0; k < 24; k++) { const a = (k / 24) * Math.PI * 2; const w = new THREE.Mesh(new THREE.BoxGeometry(o.r * 0.04, o.r * 0.04, o.r * 0.02), glow); w.position.set(Math.cos(a) * o.r * 1.1, Math.sin(a) * o.r * 1.1, 0); spin.add(w) }
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(o.r * 0.18, o.r * 0.18, o.r * 1.6, 32), metal); hub.rotation.x = Math.PI / 2
  const core = new THREE.Mesh(new THREE.SphereGeometry(o.r * 0.16, 32, 16), glow); core.position.z = o.r * 0.85
  const panelM = new THREE.MeshStandardMaterial({ color: 0x1b2a6b, metalness: 0.9, roughness: 0.2, emissive: new THREE.Color(o.accent), emissiveIntensity: 0.15 })
  for (const sx of [-1, 1]) for (let k = 0; k < 3; k++) { const p = new THREE.Mesh(new THREE.BoxGeometry(o.r * 0.5, o.r * 0.32, o.r * 0.02), panelM); p.position.set(sx * (o.r * 1.45 + k * o.r * 0.55), 0, -o.r * 0.6); g.add(p) }
  const beacons = []
  for (let k = 0; k < 4; k++) { const b = new THREE.Mesh(new THREE.SphereGeometry(o.r * 0.04, 12, 8), new THREE.MeshBasicMaterial({ color: k % 2 ? 0xff3355 : 0x55ffcc })); const a = (k / 4) * Math.PI * 2 + 0.4; b.position.set(Math.cos(a) * o.r * 1.12, Math.sin(a) * o.r * 1.12, o.r * 0.12); spin.add(b); beacons.push(b) }
  g.add(spin, hub, core)
  g.add(atmosphere(o.accent, o.r * 0.35, 2, 1.0))
  g.userData = { spinGroup: spin, beacons, spin: 0.15, hover: 0, baseScale: 1, core }
  return g
}
function sun(o) {
  const g = new THREE.Group()
  const core = new THREE.Mesh(new THREE.SphereGeometry(o.r, 64, 32), new THREE.MeshBasicMaterial({ map: planetTex(512, 77, 'rock', [[0, '#ff9a3c'], [0.5, '#ffd27a'], [1, '#fff6d8']]), color: new THREE.Color(1.3, 1.05, 0.8) }))
  g.add(core)
  g.add(atmosphere('#ffb347', o.r, 2.2, 1.1))
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot('#ffb347', 256), transparent: true, opacity: 0.45, depthWrite: false, blending: THREE.AdditiveBlending }))
  halo.scale.set(o.r * 6, o.r * 7, 1); g.add(halo)
  g.userData = { body: core, spin: 0.03, hover: 0, baseScale: 1 }
  return g
}
function constellation(o) {
  const g = new THREE.Group(), r = rng(11), pts = []
  const nodeGeo = new THREE.SphereGeometry(0.5, 16, 12)
  const colors = ['#4fd1e0', '#b9f3ff', '#c43b72', '#8f8aa8', '#ffe9c7']
  for (let i = 0; i < 46; i++) {
    const a = r() * Math.PI * 2, rad = 4 + r() * o.r, y = (r() - 0.5) * o.r * 0.5
    const p = new THREE.Vector3(Math.cos(a) * rad, y, Math.sin(a) * rad); pts.push(p)
    const c = new THREE.Color(colors[i % colors.length]).multiplyScalar(1.8)
    const m = new THREE.Mesh(nodeGeo, new THREE.MeshBasicMaterial({ color: c })); m.position.copy(p); m.scale.setScalar(0.5 + r() * 1.3); g.add(m)
  }
  const lp = []
  pts.forEach((p, i) => { const j = (i * 7 + 3) % pts.length; lp.push(0, 0, 0, p.x, p.y, p.z); if (i % 2) lp.push(p.x, p.y, p.z, pts[j].x, pts[j].y, pts[j].z) })
  const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(lp, 3))
  g.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0x4fd1e0, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending })))
  const hub = new THREE.Mesh(new THREE.IcosahedronGeometry(2.4, 2), new THREE.MeshStandardMaterial({ color: 0xffe9c7, emissive: 0xffc070, emissiveIntensity: 1.2, flatShading: true }))
  g.add(hub, atmosphere('#a6ffd9', 2.4, 2, 1.5))
  g.rotation.x = 0.35
  g.userData = { body: hub, spinGroup: g, spin: 0.06, hover: 0, baseScale: 1, wholeSpin: true }
  return g
}
function wormhole(o) {
  const g = new THREE.Group()
  for (let i = 0; i < 9; i++) {
    const t = new THREE.Mesh(new THREE.TorusGeometry(o.r * (1 - i * 0.09), 0.12 + (9 - i) * 0.03, 12, 128), new THREE.MeshBasicMaterial({ color: new THREE.Color(i % 2 ? '#b9bcff' : '#ff7ad9').multiplyScalar(1.6 - i * 0.12), transparent: true, opacity: 0.85 - i * 0.07, blending: THREE.AdditiveBlending, depthWrite: false }))
    t.position.z = -i * 2.2; g.add(t)
  }
  const glowS = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot('#b9bcff', 256), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.9 }))
  glowS.scale.set(o.r * 3, o.r * 3, 1); glowS.position.z = -12; g.add(glowS)
  g.userData = { spinGroup: g, spin: 0.25, hover: 0, baseScale: 1, rings: g.children.slice(0, 9) }
  return g
}

// ---------- extra builders (v3) ----------
function rimGlow(color, radius, power = 4.0, strength = 0.9) {
  const m = new THREE.ShaderMaterial({
    uniforms: { c: { value: new THREE.Color(color) }, p: { value: power }, s: { value: strength } },
    vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }',
    fragmentShader: 'uniform vec3 c; uniform float p; uniform float s; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0 - max(dot(vN, vV),0.0), p); gl_FragColor = vec4(c*f*s, f); }',
    blending: THREE.AdditiveBlending, side: THREE.FrontSide, transparent: true, depthWrite: false,
  })
  return new THREE.Mesh(new THREE.SphereGeometry(radius * 1.015, 64, 48), m)
}
function asteroidGeo(seed, detail) {
  const g = new THREE.IcosahedronGeometry(1, detail), p = g.attributes.position, v = new THREE.Vector3(), n = makeNoise(seed)
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i)
    const d = 1 + n(v.x * 1.7 + 3, v.y * 1.7 + v.z, 3) * 0.7 + n(v.z * 4, v.x * 4 - v.y, 2) * 0.18
    v.multiplyScalar(d); v.y *= 0.8; p.setXYZ(i, v.x, v.y, v.z)
  }
  g.computeVertexNormals(); return g
}

// ---------- main ----------
export function startScene(o: SceneOpts) {
  const { canvas, mobile, reduced } = o
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' })
  const maxDpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75)
  let dpr = mobile ? Math.min(1.2, maxDpr) : maxDpr
  renderer.setPixelRatio(dpr); renderer.setSize(window.innerWidth, window.innerHeight, false)
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.95
  let lost = false
  const onLost = (e) => { e.preventDefault(); lost = true; running = false; cancelAnimationFrame(raf); o.onLost && o.onLost() }
  canvas.addEventListener('webglcontextlost', onLost)

  const N = o.stopCount, GAP = 240
  ZLEN = N * GAP + 700
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x02010a); scene.fog = new THREE.FogExp2(0x02010a, 0.0014)
  const camera = new THREE.PerspectiveCamera(mobile ? 72 : 60, window.innerWidth / window.innerHeight, 0.1, 4000)
  scene.add(new THREE.AmbientLight(0x2c2c55, 0.55))
  const key = new THREE.DirectionalLight(0xfff0d8, 2.8); key.position.set(-50, 40, 80); scene.add(key)
  const rim = new THREE.DirectionalLight(0x7f8cff, 1.3); rim.position.set(70, -20, -90); scene.add(rim)

  // Stops: planets laid out along a winding route.
  const R = [9, 16, 13, 11, 10]
  const objPts = [], viewPts = [], targets = []
  const portrait = () => window.innerWidth / window.innerHeight < 0.9
  for (let i = 0; i < N; i++) objPts.push(new THREE.Vector3(Math.sin(i * 1.9) * 70, Math.cos(i * 1.3) * 22, -i * GAP))
  function layoutViews() {
    viewPts.length = 0; targets.length = 0
    for (let i = 0; i < N; i++) {
      const P = objPts[i], r = R[i] || 10
      if (portrait()) { viewPts.push(P.clone().add(new THREE.Vector3(r * 0.3, r * 0.15, r * 4.6))); targets.push(P.clone().add(new THREE.Vector3(0, -r * 1.05, 0))) }
      else { viewPts.push(P.clone().add(new THREE.Vector3(-r * 1.0, r * 0.2, r * 3.4))); targets.push(P.clone().add(new THREE.Vector3(-r * 1.15, 0, 0))) }
    }
  }
  layoutViews()
  let curve
  function buildCurve() {
    const ctrl = []
    for (let i = 0; i < N; i++) {
      ctrl.push(viewPts[i])
      if (i < N - 1) {
        const a = viewPts[i], b = viewPts[i + 1], s = i % 2 ? 1 : -1
        ctrl.push(new THREE.Vector3().lerpVectors(a, b, 0.33).add(new THREE.Vector3(s * 60, 18 * s, 0)))
        ctrl.push(new THREE.Vector3().lerpVectors(a, b, 0.66).add(new THREE.Vector3(-s * 45, -14 * s, 0)))
      }
    }
    curve = new THREE.CatmullRomCurve3(ctrl, false, 'catmullrom', 0.5)
  }
  buildCurve()

  // Starfield + nebulae.
  const layers = mobile
    ? [starLayer(1200, 160, 4, 1.0, 1, mobile), starLayer(900, 260, 120, 1.7, 2, mobile), starLayer(350, 500, 380, 3.4, 3, mobile)]
    : [starLayer(5000, 160, 4, 0.8, 1, mobile), starLayer(3000, 260, 120, 1.4, 2, mobile), starLayer(900, 500, 380, 3.0, 3, mobile)]
  layers.forEach((l, i) => { l.userData.par = [0.0, 0.3, 0.6][i]; scene.add(l) })
  const nebCols = ['#c43b72', '#4aa8b8', '#7a4de0', '#e0823c', '#ff7ad9']
  const nebTex = nebCols.map((c, i) => nebulaTex(100 + i, c))
  const nebs = [], nr = rng(7)
  for (let i = 0; i < (mobile ? 16 : 36); i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: nebTex[i % nebTex.length], transparent: true, opacity: 0.18 + nr() * 0.22, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }))
    const k = 160 + nr() * 320; s.scale.set(k, k * (0.6 + nr() * 0.6), 1); s.material.rotation = nr() * 6.28
    s.position.set((nr() - 0.5) * 520, (nr() - 0.5) * 260, 100 - nr() * (ZLEN + 200)); s.userData.rs = (nr() - 0.5) * 0.02; scene.add(s); nebs.push(s)
  }

  // Bodies.
  const icy = planet({ r: R[3], seed: 31, kind: 'rock', palette: [[0, '#061a26'], [0.4, '#1d5a66'], [0.55, '#4fb39a'], [0.75, '#b8e8da'], [1, '#e8fff6']], glow: '#a6ffd9', mobile, spin: 0.05 })
  const cons = constellation({ r: 34 }); cons.userData.body = null
  const ecoGroup = new THREE.Group(); ecoGroup.add(icy, cons); ecoGroup.userData = {}
  const objs = [
    sun({ r: R[0] }),
    planet({ r: R[1], seed: 4, kind: 'gas', palette: [[0, '#2a0f3d'], [0.35, '#8a2c7a'], [0.6, '#ff7ad9'], [0.8, '#ffd27a'], [1, '#fff1f8']], glow: '#ff7ad9', rings: [255, 200, 235], mobile, spin: 0.05 }),
    planet({ r: R[2], seed: 9, kind: 'rock', palette: [[0, '#06204a'], [0.46, '#0f5ea8'], [0.5, '#2f9bd6'], [0.52, '#d8c48a'], [0.6, '#3d8a3a'], [0.78, '#2b5e2a'], [0.9, '#8a8a8a'], [1, '#ffffff']], glow: '#7fe3ff', clouds: true, mobile, spin: 0.07 }),
    ecoGroup,
    wormhole({ r: R[4] }),
  ].slice(0, N)
  objs[1] && objs[1].add(rimGlow('#ff9ae6', R[1]))
  objs[2] && objs[2].add(rimGlow('#9fe9ff', R[2] * 1.02))
  icy.add(rimGlow('#c8ffee', R[3]))
  objs.forEach((g, i) => { g.position.copy(objPts[i]); scene.add(g) })
  const fm = station({ r: 4.2, accent: '#ff7ad9', mobile }); scene.add(fm)
  const invoice = planet({ r: 2.8, seed: 21, kind: 'rock', palette: [[0, '#2b2a3a'], [0.5, '#9a96b8'], [1, '#e8e4ff']], glow: '#b9bcff', mobile, spin: 0.1 }); scene.add(invoice)
  const shopStation = station({ r: 2.6, accent: '#7fe3ff', mobile }); scene.add(shopStation)
  const spinners = [...objs, icy, fm, invoice, shopStation]
  const orbitLights = []
  ;[1, 2, 4].filter((i) => i < N).forEach((idx, k) => {
    const col = ['#ff7ad9', '#7fe3ff', '#b9bcff'][k]
    const L = new THREE.PointLight(col, 300, 70, 2)
    L.add(new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(3) })))
    scene.add(L); orbitLights.push({ L, c: objPts[idx], r: [28, 22, 18][k], s: [0.5, 0.7, 0.9][k] })
  })

  // Asteroid belts hugging the flight path, some passing within a few metres of the camera.
  const AN = mobile ? 280 : 760
  const aMat = new THREE.MeshStandardMaterial({ color: 0x8a8090, roughness: 0.95, metalness: 0.05, flatShading: true })
  const aGeos = [asteroidGeo(3, 1), asteroidGeo(8, 1), asteroidGeo(13, mobile ? 1 : 2)]
  const aMeshes = aGeos.map((g) => new THREE.InstancedMesh(g, aMat, Math.ceil(AN / 3)))
  const aData = [], ar = rng(99), tv = new THREE.Vector3(), nv = new THREE.Vector3()
  const tint = [new THREE.Color('#9a8f86'), new THREE.Color('#6f6a80'), new THREE.Color('#a68a6e'), new THREE.Color('#5d6f7a')]
  for (let k = 0; k < AN; k++) {
    const mi = k % 3, idx = Math.floor(k / 3); let pos, tries = 0
    do {
      const u = ar(); curve.getPoint(u, tv)
      const close = ar() < 0.35, d = close ? 3 + ar() * 10 : 14 + ar() * ar() * 120, a = ar() * 6.28
      nv.set(Math.cos(a) * d, Math.sin(a) * d * 0.7, (ar() - 0.5) * 30); pos = tv.clone().add(nv); tries++
    } while (tries < 8 && objPts.some((P, i) => P.distanceTo(pos) < (R[i] || 10) * 2.2) || viewPts.some((V) => V.distanceTo(pos) < 6))
    const near = pos.distanceTo(tv) < 14, s = near ? 0.25 + ar() * 1.1 : 0.8 + ar() * ar() * 6
    aData.push({ m: mi, i: idx, p: pos, s: new THREE.Vector3(s * (0.7 + ar() * 0.6), s * (0.7 + ar() * 0.6), s), r: new THREE.Euler(ar() * 6, ar() * 6, ar() * 6), w: new THREE.Vector3((ar() - 0.5) * 1.2, (ar() - 0.5) * 1.2, (ar() - 0.5) * 1.2), drift: new THREE.Vector3((ar() - 0.5) * 0.8, (ar() - 0.5) * 0.4, (ar() - 0.5) * 0.8) })
    aMeshes[mi].setColorAt(idx, tint[k % tint.length])
  }
  aMeshes.forEach((m) => { m.instanceColor.needsUpdate = true; m.frustumCulled = false; scene.add(m) })
  const mtx = new THREE.Matrix4(), qa = new THREE.Quaternion(), pa = new THREE.Vector3()
  function updateAsteroids(t, dt) {
    for (const a of aData) {
      a.r.x += a.w.x * dt; a.r.y += a.w.y * dt; a.r.z += a.w.z * dt
      pa.copy(a.p).addScaledVector(a.drift, Math.sin(t * 0.1) * 6)
      mtx.compose(pa, qa.setFromEuler(a.r), a.s); aMeshes[a.m].setMatrixAt(a.i, mtx)
    }
    aMeshes.forEach((m) => (m.instanceMatrix.needsUpdate = true))
  }

  // World-space space dust that streams past the camera (always moving, even when parked).
  const DN = mobile ? 500 : 1400, dPos = new Float32Array(DN * 3)
  const dGeo = new THREE.BufferGeometry(); dGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3))
  const dust = new THREE.Points(dGeo, new THREE.PointsMaterial({ size: mobile ? 0.16 : 0.12, map: softDot('#ffffff', 32), color: new THREE.Color(1.6, 1.7, 2.0), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true }))
  dust.frustumCulled = false; scene.add(dust)
  let dustInit = false
  const fwd = new THREE.Vector3(), rel = new THREE.Vector3()
  function spawnDust(i, cam, ahead) {
    const z = ahead ? 40 + Math.random() * 40 : Math.random() * 80
    const x = (Math.random() - 0.5) * 50, y = (Math.random() - 0.5) * 34
    rel.set(x, y, -z).applyQuaternion(cam.quaternion).add(cam.position); dPos.set([rel.x, rel.y, rel.z], i * 3)
  }

  // Warp streaks attached to the camera.
  const SN = mobile ? 180 : 460, sPos = new Float32Array(SN * 6), sSeed = []
  const sr = rng(5); for (let i = 0; i < SN; i++) { const a = sr() * 6.28, d = 2.5 + sr() * 24; sSeed.push([Math.cos(a) * d, Math.sin(a) * d * 0.7, -sr() * 160]) }
  const sGeo = new THREE.BufferGeometry(); sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3))
  const streaks = new THREE.LineSegments(sGeo, new THREE.LineBasicMaterial({ color: 0xbfe9ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }))
  streaks.frustumCulled = false; camera.add(streaks); scene.add(camera)

  // Post.
  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  const bs = mobile ? 0.5 : 0.85
  const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth * bs, window.innerHeight * bs), mobile ? 0.6 : 0.8, 0.5, 0.55)
  composer.addPass(bloom); composer.addPass(new OutputPass())
  composer.setPixelRatio(dpr)
  layers.forEach((l) => (l.material.uniforms.px.value = dpr))

  // Look-around: mouse on desktop, gyro on phones (enabled by the component after a tap on iOS).
  const look = new THREE.Vector2(), lookS = new THREE.Vector2()
  const onMove = (e) => { if (e.pointerType === 'touch') return; look.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1) }
  window.addEventListener('pointermove', onMove, { passive: true })
  let g0 = null
  const onOri = (e) => {
    if (e.beta == null || e.gamma == null) return
    if (!g0) g0 = { b: e.beta, g: e.gamma }
    look.set(Math.max(-1, Math.min(1, (e.gamma - g0.g) / 30)), Math.max(-1, Math.min(1, -(e.beta - g0.b) / 30)))
    g0.b += (e.beta - g0.b) * 0.004; g0.g += (e.gamma - g0.g) * 0.004 // slowly re-centre
  }
  window.addEventListener('deviceorientation', onOri)
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight, false); composer.setSize(window.innerWidth, window.innerHeight)
    bloom.resolution.set(window.innerWidth * bs, window.innerHeight * bs)
    layoutViews(); buildCurve()
  }
  window.addEventListener('resize', onResize)

  const M = reduced ? { look: 0.45, bank: 0.35, idle: 0.25, rate: 2.2, fov: 0, streak: 0, dust: 0.35 } : { look: 1, bank: 1, idle: 1, rate: 3.4, fov: 1, streak: 1, dust: 1 }
  let f = Math.min(N - 1, o.getProgress()), lastF = f, speed = 0, running = true, raf = 0, ready = false, roll = 0
  const clock = new THREE.Clock(), pos = new THREE.Vector3(), ahead = new THREE.Vector3(), dirA = new THREE.Vector3(), dirB = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0)
  const t1 = new THREE.Vector3(), t2 = new THREE.Vector3(), m4 = new THREE.Matrix4(), qBase = new THREE.Quaternion(), qOff = new THREE.Quaternion(), eOff = new THREE.Euler(0, 0, 0, 'YXZ'), qT = new THREE.Quaternion()
  const smooth = (x) => x * x * (3 - 2 * x)
  function uOf(fr) {
    const seg = Math.min(N - 2, Math.floor(fr)), x = fr - seg
    const k = Math.max(0, Math.min(1, (x - 0.1) / 0.8))
    return (seg + smooth(k)) / (N - 1)
  }
  function pose(dt, t, snap) {
    const u = uOf(f)
    curve.getPoint(u, pos)
    const near = Math.round(f), w = smooth(Math.max(0, 1 - Math.abs(f - near) / 0.42))
    const ua = Math.min(1, u + 0.01)
    if (ua > u) { curve.getPoint(ua, ahead); dirA.subVectors(ahead, pos).normalize() } else dirA.subVectors(targets[near], pos).normalize()
    dirB.subVectors(targets[near], pos).normalize()
    dirA.lerp(dirB, w).normalize()
    // Bank into the curve: sign of the turn from the change in tangent.
    curve.getTangent(Math.max(0, u - 0.004), t1); curve.getTangent(Math.min(1, u + 0.004), t2)
    const turn = t1.x * t2.z - t1.z * t2.x
    const want = Math.max(-0.55, Math.min(0.55, turn * 90)) * (1 - w) * M.bank
    roll += (want - roll) * (snap ? 1 : 1 - Math.exp(-dt * 2.5))
    pos.x += Math.sin(t * 0.37) * 0.7 * M.idle; pos.y += Math.sin(t * 0.53) * 0.45 * M.idle
    camera.position.copy(pos)
    m4.lookAt(pos, ahead.copy(pos).add(dirA), up); qBase.setFromRotationMatrix(m4)
    lookS.lerp(look, snap ? 1 : 1 - Math.exp(-dt * 3))
    eOff.set(lookS.y * 0.28 * M.look, -lookS.x * 0.42 * M.look, roll - lookS.x * 0.05 * M.look)
    qT.copy(qBase).multiply(qOff.setFromEuler(eOff))
    if (snap) camera.quaternion.copy(qT); else camera.quaternion.slerp(qT, 1 - Math.exp(-dt * 6))
  }

  const capture = /[?&]capture=1/.test(location.search)
  let simT = 0, accT = 0, accN = 0
  function frame(forced?: number) {
    if (!running || lost) return
    const real = clock.getDelta()
    let dt = Math.min(real, 0.05)
    if (capture) { dt = typeof forced === 'number' ? forced : 1 / 30; simT += dt }
    const t = capture ? simT : clock.elapsedTime
    const target = Math.min(N - 1, Math.max(0, o.getProgress()))
    f += (target - f) * (1 - Math.exp(-dt * M.rate))
    if (Math.abs(target - f) < 1e-4) f = target
    const v = Math.abs(f - lastF) / Math.max(dt, 1e-3); lastF = f
    speed += (Math.min(1, v * 1.6) - speed) * (1 - Math.exp(-dt * 5))
    pose(dt, t, false)
    camera.fov = (mobile ? 72 : 60) + speed * 22 * M.fov; camera.updateProjectionMatrix()
    bloom.strength = (mobile ? 0.6 : 0.8) + speed * 0.5 * M.fov

    for (const g of spinners) {
      const ud = g.userData
      if (ud.body && !ud.wholeSpin) ud.body.rotation.y += dt * ud.spin
      if (ud.clouds) ud.clouds.rotation.y += dt * ud.spin * 1.5
      if (ud.spinGroup) { if (ud.rings) ud.rings.forEach((r, i) => (r.rotation.z += dt * (0.2 + i * 0.08) * (i % 2 ? -1 : 1))); else if (ud.wholeSpin) ud.spinGroup.rotation.y += dt * ud.spin; else ud.spinGroup.rotation.z += dt * ud.spin }
      if (ud.beacons) ud.beacons.forEach((b, i) => (b.visible = Math.sin(t * 4 + i * 1.7) > 0))
    }
    cons.rotation.y += dt * 0.05
    if (N > 1) { const s = objPts[1]; fm.position.set(s.x + Math.cos(t * 0.25) * 34, s.y + 6 + Math.sin(t * 0.25) * 5, s.z + Math.sin(t * 0.25) * 34); fm.lookAt(camera.position); invoice.position.set(s.x + Math.cos(t * 0.18 + 2.6) * 26, s.y - 6, s.z + Math.sin(t * 0.18 + 2.6) * 26) }
    if (N > 2) { const s = objPts[2]; shopStation.position.set(s.x + Math.cos(-t * 0.3) * 22, s.y + Math.sin(t * 0.3) * 8, s.z + Math.sin(-t * 0.3) * 22); shopStation.lookAt(camera.position) }
    orbitLights.forEach((l) => l.L.position.set(l.c.x + Math.cos(t * l.s) * l.r, l.c.y + Math.sin(t * l.s * 1.3) * 6, l.c.z + Math.sin(t * l.s) * l.r))
    updateAsteroids(t, dt * (reduced ? 0.4 : 1))
    layers.forEach((l) => { l.material.uniforms.t.value = t; l.position.x = -lookS.x * 12 * l.userData.par; l.position.y = -lookS.y * 7 * l.userData.par })
    nebs.forEach((n) => (n.material.rotation += dt * n.userData.rs))

    // Dust.
    camera.getWorldDirection(fwd)
    if (!dustInit) { for (let i = 0; i < DN; i++) spawnDust(i, camera, false); dustInit = true }
    const dv = (5 + speed * 40) * M.dust * dt
    for (let i = 0; i < DN; i++) {
      const j = i * 3; dPos[j] -= fwd.x * dv; dPos[j + 1] -= fwd.y * dv; dPos[j + 2] -= fwd.z * dv
      rel.set(dPos[j] - camera.position.x, dPos[j + 1] - camera.position.y, dPos[j + 2] - camera.position.z)
      const along = rel.dot(fwd)
      if (along < 0.5 || along > 95 || rel.lengthSq() > 9000) spawnDust(i, camera, along < 0.5)
    }
    dGeo.attributes.position.needsUpdate = true

    // Warp streaks between stops.
    streaks.material.opacity = Math.min(0.85, speed * 1.3) * M.streak
    const len = 0.5 + speed * 30
    for (let i = 0; i < SN; i++) {
      const s = sSeed[i]; s[2] += dt * (20 + speed * 320); if (s[2] > 0) s[2] -= 160
      sPos.set([s[0], s[1], s[2], s[0], s[1], s[2] - len], i * 6)
    }
    sGeo.attributes.position.needsUpdate = true

    composer.render()
    if (!ready) { ready = true; o.onReady() }
    o.onFrame && o.onFrame({ f, speed, dpr })

    // Adaptive resolution.
    if (!capture) {
      accT += real; accN++
      if (accN >= 45) {
        const avg = accT / accN; accT = 0; accN = 0
        const next = avg > 0.024 ? Math.max(0.7, dpr - 0.15) : avg < 0.015 ? Math.min(maxDpr, dpr + 0.1) : dpr
        if (Math.abs(next - dpr) > 0.01) { dpr = next; renderer.setPixelRatio(dpr); composer.setPixelRatio(dpr); renderer.setSize(window.innerWidth, window.innerHeight, false); composer.setSize(window.innerWidth, window.innerHeight); layers.forEach((l) => (l.material.uniforms.px.value = dpr)) }
      }
      raf = requestAnimationFrame(frame)
    }
  }

  pose(0, 0, true)
  if (capture) { window.__spaceFrame = (dt) => frame(dt); frame(0.016) } else raf = requestAnimationFrame(frame)
  const onVis = () => { if (document.hidden) { running = false; cancelAnimationFrame(raf) } else if (!running && !lost) { running = true; clock.getDelta(); raf = requestAnimationFrame(frame) } }
  document.addEventListener('visibilitychange', onVis)
  return () => {
    running = false; cancelAnimationFrame(raf)
    window.removeEventListener('pointermove', onMove); window.removeEventListener('deviceorientation', onOri); window.removeEventListener('resize', onResize)
    document.removeEventListener('visibilitychange', onVis); canvas.removeEventListener('webglcontextlost', onLost); renderer.dispose()
  }
}
