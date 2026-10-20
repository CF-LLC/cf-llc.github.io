/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unused-vars */
// @ts-nocheck -- three is bundled from npm; scene code is plain imperative three.js
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

export type SceneOpts = { canvas: HTMLCanvasElement; mobile: boolean; reduced: boolean; stopCount: number; getProgress: () => number; onReady: () => void }

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
    pos[i * 3] = Math.cos(a) * d; pos[i * 3 + 1] = Math.sin(a) * d * 0.8; pos[i * 3 + 2] = 120 - r() * 1100
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

// ---------- main ----------
export function startScene(o: SceneOpts) {
  const { canvas, mobile, reduced } = o
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' })
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.3 : 1.75)
  renderer.setPixelRatio(dpr); renderer.setSize(window.innerWidth, window.innerHeight, false)
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.9
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x03020a); scene.fog = new THREE.FogExp2(0x03020a, 0.0022)
  const camera = new THREE.PerspectiveCamera(mobile ? 68 : 55, window.innerWidth / window.innerHeight, 0.1, 2000)

  scene.add(new THREE.AmbientLight(0x40406a, 0.6))
  const key = new THREE.DirectionalLight(0xfff0d8, 2.4); key.position.set(-60, 30, 60); scene.add(key)
  const rim = new THREE.DirectionalLight(0x7f8cff, 1.0); rim.position.set(60, -20, -80); scene.add(rim)

  // Flight path: stops along -z, swinging left/right.
  const N = o.stopCount, GAP = 150
  const viewPts = [], objPts = []
  for (let i = 0; i < N; i++) {
    const x = (i % 2 ? -1 : 1) * 18, z = -i * GAP
    viewPts.push(new THREE.Vector3(x * 0.2, Math.sin(i) * 6 + 4, z + 78))
    objPts.push(new THREE.Vector3(x, Math.sin(i) * 6, z))
  }
  const ctrl = []
  for (let i = 0; i < N; i++) {
    ctrl.push(viewPts[i])
    if (i < N - 1) ctrl.push(new THREE.Vector3((i % 2 ? 1 : -1) * 10, 30, (viewPts[i].z + viewPts[i + 1].z) / 2))
  }
  const curve = new THREE.CatmullRomCurve3(ctrl, false, 'catmullrom', 0.5)

  // Starfield: three layers for parallax depth.
  const layers = mobile
    ? [starLayer(900, 60, 30, 1.0, 1, mobile), starLayer(700, 220, 90, 1.6, 2, mobile), starLayer(250, 400, 260, 3.2, 3, mobile)]
    : [starLayer(4000, 60, 30, 0.8, 1, mobile), starLayer(2600, 220, 90, 1.4, 2, mobile), starLayer(700, 400, 260, 3.0, 3, mobile)]
  layers.forEach((l, i) => { l.userData.par = [0.0, 0.25, 0.55][i]; scene.add(l) })

  // Nebulae: stacked noisy sprites read as volume.
  const nebCols = ['#c43b72', '#4aa8b8', '#7a4de0', '#e0823c', '#ff7ad9']
  const nebTex = nebCols.map((c, i) => nebulaTex(100 + i, c))
  const nebs = [], nr = rng(7)
  for (let i = 0; i < (mobile ? 14 : 34); i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: nebTex[i % nebTex.length], transparent: true, opacity: 0.16 + nr() * 0.2, depthWrite: false, blending: THREE.AdditiveBlending }))
    const k = 120 + nr() * 260; s.scale.set(k, k * (0.6 + nr() * 0.6), 1)
    s.material.rotation = nr() * 6.28
    const zi = Math.floor(nr() * N)
    s.position.set((nr() - 0.5) * 420, (nr() - 0.5) * 220, -zi * GAP - 120 - nr() * 160)
    s.userData.rs = (nr() - 0.5) * 0.02; scene.add(s); nebs.push(s)
  }

  // Stops.
  const objs = [
    sun({ r: 9 }),
    planet({ r: 14, seed: 4, kind: 'gas', palette: [[0, '#2a0f3d'], [0.35, '#8a2c7a'], [0.6, '#ff7ad9'], [0.8, '#ffd27a'], [1, '#fff1f8']], glow: '#ff7ad9', rings: [255, 200, 235], mobile, spin: 0.04 }),
    planet({ r: 13, seed: 9, kind: 'rock', palette: [[0, '#06204a'], [0.46, '#0f5ea8'], [0.5, '#2f9bd6'], [0.52, '#d8c48a'], [0.6, '#3d8a3a'], [0.78, '#2b5e2a'], [0.9, '#8a8a8a'], [1, '#ffffff']], glow: '#7fe3ff', clouds: true, mobile, spin: 0.06 }),
    constellation({ r: 22 }),
    wormhole({ r: 11 }),
  ]
  objs.forEach((g, i) => { g.position.copy(objPts[i]); scene.add(g) })
  // Satellites around SaaS Nation: Funnel Maker station and InvoiceForge moon.
  const fm = station({ r: 4.2, accent: '#ff7ad9', mobile }); scene.add(fm)
  const invoice = planet({ r: 2.6, seed: 21, kind: 'rock', palette: [[0, '#2b2a3a'], [0.5, '#9a96b8'], [1, '#e8e4ff']], glow: '#b9bcff', mobile, spin: 0.1 }); scene.add(invoice)
  // Station near SpockShop for orbiting traffic.
  const shopStation = station({ r: 2.4, accent: '#7fe3ff', mobile }); scene.add(shopStation)
  const hoverables = [...objs, fm, invoice, shopStation]
  // Moving lights orbiting the big bodies.
  const orbitLights = []
  ;[1, 2, 4].forEach((idx, k) => {
    const L = new THREE.PointLight(['#ff7ad9', '#7fe3ff', '#b9bcff'][k], 600, 80, 2)
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(['#ff7ad9', '#7fe3ff', '#b9bcff'][k]).multiplyScalar(3) }))
    L.add(bulb); scene.add(L); orbitLights.push({ L, c: objPts[idx], r: [24, 20, 16][k], s: [0.5, 0.7, 0.9][k] })
  })

  // Warp streaks: line segments around the camera, stretched by speed.
  const SN = mobile ? 160 : 420, sPos = new Float32Array(SN * 6), sSeed = []
  const sr = rng(5); for (let i = 0; i < SN; i++) { const a = sr() * 6.28, d = 3 + sr() * 26; sSeed.push([Math.cos(a) * d, Math.sin(a) * d * 0.7, -sr() * 160]) }
  const sGeo = new THREE.BufferGeometry(); sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3))
  const streaks = new THREE.LineSegments(sGeo, new THREE.LineBasicMaterial({ color: 0xbfe9ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }))
  streaks.frustumCulled = false; camera.add(streaks); scene.add(camera)

  // Cursor-reactive sparkles.
  const PN = mobile ? 60 : 160, pPos = new Float32Array(PN * 3), pLife = new Float32Array(PN), pVel = []
  for (let i = 0; i < PN; i++) { pVel.push(new THREE.Vector3()); pPos[i * 3 + 2] = -9999 }
  const pGeo = new THREE.BufferGeometry(); pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
  const sparks = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.5, map: softDot('#ffffff', 64), color: new THREE.Color(2, 1.6, 2.4), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  sparks.frustumCulled = false; scene.add(sparks)
  let pi = 0

  // Post: bloom.
  let composer = null, bloom = null
  composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  const bs = mobile ? 0.5 : 1
  bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth * bs, window.innerHeight * bs), mobile ? 0.55 : 0.75, 0.45, 0.55)
  composer.addPass(bloom); composer.addPass(new OutputPass())
  layers.forEach((l) => (l.material.uniforms.px.value = dpr))

  // Input.
  const mouse = new THREE.Vector2(), smooth = new THREE.Vector2(), ray = new THREE.Raycaster(); let hasPointer = false, lastSpawn = 0
  const onMove = (e) => { const p = e.touches ? e.touches[0] : e; mouse.set((p.clientX / window.innerWidth) * 2 - 1, -(p.clientY / window.innerHeight) * 2 + 1); hasPointer = true }
  window.addEventListener('pointermove', onMove, { passive: true }); window.addEventListener('touchmove', onMove, { passive: true })
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight, false); composer.setSize(window.innerWidth, window.innerHeight)
    bloom.resolution.set(window.innerWidth * bs, window.innerHeight * bs)
  }
  window.addEventListener('resize', onResize)

  let prog = o.getProgress(), lastProg = prog, speed = 0, running = true, raf = 0, ready = false
  const clock = new THREE.Clock(), tmp = new THREE.Vector3(), look = new THREE.Vector3(), lookS = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0)
  const ease = (f) => 0.5 - 0.5 * Math.cos(Math.PI * f)

  function place(p, dt, t) {
    const seg = Math.min(N - 2, Math.floor(p * (N - 1))), f = Math.min(1, p * (N - 1) - seg), e = ease(f)
    const u = (seg + e) / (N - 1)
    curve.getPoint(u, tmp)
    camera.position.copy(tmp)
    // Look at the object we are arriving at; offset so it sits beside the glass panel.
    const a = objPts[seg], b = objPts[seg + 1]
    look.lerpVectors(a, b, e)
    const side = mobile ? new THREE.Vector3(0, -30, 0) : new THREE.Vector3(-26, 0, 0)
    look.add(side)
    if (dt === 0) lookS.copy(look); else lookS.lerp(look, 1 - Math.exp(-dt * 5))
    // Parallax tilt.
    camera.position.x += smooth.x * 3.5; camera.position.y += smooth.y * 2.2
    camera.lookAt(lookS)
    camera.rotation.z += -smooth.x * 0.03
  }

  // ?capture=1: deterministic frame stepping for recording videos/screenshots on slow software GL.
  const capture = /[?&]capture=1/.test(location.search)
  let simT = 0
  function frame(forced?: number) {
    if (!running) return
    let dt = Math.min(clock.getDelta(), 0.05)
    if (capture) { dt = typeof forced === 'number' ? forced : 1 / 30; simT += dt }
    const t = capture ? simT : clock.elapsedTime
    const target = o.getProgress()
    prog += (target - prog) * (1 - Math.exp(-dt * 3.2))
    const v = Math.abs(prog - lastProg) / Math.max(dt, 1e-3); lastProg = prog
    speed += (Math.min(1, v * 3) - speed) * (1 - Math.exp(-dt * 6))
    smooth.lerp(hasPointer ? mouse : smooth.set(0, 0), 1 - Math.exp(-dt * 3))
    place(prog, dt, t)
    camera.fov = (mobile ? 68 : 55) + speed * 14; camera.updateProjectionMatrix()

    // Animate bodies.
    for (const g of hoverables) {
      const u = g.userData
      if (u.body && !u.wholeSpin) u.body.rotation.y += dt * u.spin
      if (u.clouds) u.clouds.rotation.y += dt * u.spin * 1.4
      if (u.spinGroup) { if (u.rings) u.rings.forEach((r, i) => (r.rotation.z += dt * (0.2 + i * 0.08) * (i % 2 ? -1 : 1))); else if (u.wholeSpin) u.spinGroup.rotation.y += dt * u.spin; else u.spinGroup.rotation.z += dt * u.spin }
      if (u.beacons) u.beacons.forEach((b, i) => (b.visible = Math.sin(t * 4 + i * 1.7) > 0))
      const s = u.baseScale * (1 + u.hover * 0.08); g.scale.lerp(tmp.set(s, s, s), 1 - Math.exp(-dt * 6))
      if (u.body && u.body.material.emissiveIntensity !== undefined) u.body.material.emissiveIntensity = u.hover * 0.35
      u.hover += ((u.hovered ? 1 : 0) - u.hover) * (1 - Math.exp(-dt * 8))
    }
    const sat = objPts[1]
    fm.position.set(sat.x + Math.cos(t * 0.25) * 30, sat.y + 6 + Math.sin(t * 0.25) * 4, sat.z + Math.sin(t * 0.25) * 30); fm.lookAt(camera.position)
    invoice.position.set(sat.x + Math.cos(t * 0.18 + 2.6) * 22, sat.y - 5, sat.z + Math.sin(t * 0.18 + 2.6) * 22)
    const sp = objPts[2]; shopStation.position.set(sp.x + Math.cos(-t * 0.3) * 21, sp.y + Math.sin(t * 0.3) * 8, sp.z + Math.sin(-t * 0.3) * 21); shopStation.lookAt(camera.position)
    orbitLights.forEach((l) => l.L.position.set(l.c.x + Math.cos(t * l.s) * l.r, l.c.y + Math.sin(t * l.s * 1.3) * 6, l.c.z + Math.sin(t * l.s) * l.r))

    layers.forEach((l) => { l.material.uniforms.t.value = t; l.position.x = -smooth.x * 10 * l.userData.par; l.position.y = -smooth.y * 6 * l.userData.par })
    nebs.forEach((n) => (n.material.rotation += dt * n.userData.rs))

    // Warp streaks.
    streaks.material.opacity = Math.min(0.7, speed * 1.1)
    const len = 0.5 + speed * 22
    for (let i = 0; i < SN; i++) {
      const s = sSeed[i]; s[2] += dt * (30 + speed * 260); if (s[2] > 0) s[2] -= 160
      sPos.set([s[0], s[1], s[2], s[0], s[1], s[2] - len], i * 6)
    }
    sGeo.attributes.position.needsUpdate = true

    // Hover + sparks.
    if (hasPointer) {
      ray.setFromCamera(mouse, camera)
      for (const g of hoverables) { g.userData.hovered = false }
      const hit = ray.intersectObjects(hoverables, true)[0]
      if (hit) { let g = hit.object; while (g && !hoverables.includes(g)) g = g.parent; if (g) g.userData.hovered = true }
      document.body.style.cursor = hit ? 'pointer' : ''
      if (t - lastSpawn > 0.016) {
        lastSpawn = t
        const at = ray.ray.at(14, new THREE.Vector3())
        for (let k = 0; k < 2; k++) { pPos.set([at.x, at.y, at.z], pi * 3); pVel[pi].set((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3); pLife[pi] = 1; pi = (pi + 1) % PN }
      }
    }
    for (let i = 0; i < PN; i++) if (pLife[i] > 0) { pLife[i] -= dt * 1.2; pPos[i * 3] += pVel[i].x * dt; pPos[i * 3 + 1] += pVel[i].y * dt; pPos[i * 3 + 2] += pVel[i].z * dt; if (pLife[i] <= 0) pPos[i * 3 + 2] = -9999 }
    pGeo.attributes.position.needsUpdate = true

    composer.render()
    if (!ready) { ready = true; o.onReady() }
    if (!capture) raf = requestAnimationFrame(frame)
  }

  if (reduced) {
    // Static, composed overview: no flight, single render (re-rendered on resize).
    const still = () => {
      camera.position.set(mobile ? 30 : 46, 14, 70); camera.lookAt(mobile ? 4 : -14, mobile ? -14 : 0, -170); camera.fov = mobile ? 70 : 55; camera.updateProjectionMatrix()
      fm.position.set(objPts[1].x + 26, objPts[1].y + 6, objPts[1].z + 10); invoice.position.set(objPts[1].x - 20, objPts[1].y - 5, objPts[1].z + 14)
      shopStation.position.set(objPts[2].x + 18, objPts[2].y + 4, objPts[2].z + 8)
      orbitLights.forEach((l) => l.L.position.set(l.c.x + l.r, l.c.y + 4, l.c.z + l.r))
      composer.render()
    }
    still(); window.addEventListener('resize', still); o.onReady()
    return () => { window.removeEventListener('resize', still); window.removeEventListener('resize', onResize); renderer.dispose() }
  }

  place(prog, 0, 0)
  if (capture) { window.__spaceFrame = (dt) => frame(dt); frame(0.016) } else raf = requestAnimationFrame(frame)
  const onVis = () => { if (document.hidden) { running = false; cancelAnimationFrame(raf) } else if (!running) { running = true; clock.getDelta(); raf = requestAnimationFrame(frame) } }
  document.addEventListener('visibilitychange', onVis)
  return () => {
    running = false; cancelAnimationFrame(raf)
    window.removeEventListener('pointermove', onMove); window.removeEventListener('touchmove', onMove); window.removeEventListener('resize', onResize)
    document.removeEventListener('visibilitychange', onVis); renderer.dispose()
  }
}
