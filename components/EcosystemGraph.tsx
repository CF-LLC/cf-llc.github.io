'use client'

/* eslint-disable @typescript-eslint/no-explicit-any -- untyped CDN library */
import { useEffect, useRef, useState } from 'react'
import data from '../data/ecosystem.json'

// Pinned CDN build with Subresource Integrity.
const LIB_SRC = 'https://cdn.jsdelivr.net/npm/3d-force-graph@1.80.1/dist/3d-force-graph.min.js'
const LIB_SRI = 'sha384-i98VDQKdpyVrtyuFn0fjUWJBLBmxnqHqOANcvYe9HLJUgT2wPixa4ZkLd7Dh3VEk'

type Group = 'center' | 'public' | 'soon' | 'private'
type Node = { id: string; name: string; group: Group; url?: string; desc?: string; parent?: string }
type Status = 'checking' | 'up' | 'unknown' | 'down'

const COLORS: Record<Group, string> = {
  center: '#eceae4',
  public: '#4aa8b8',
  soon: '#c56a2b',
  private: '#c43b72',
}

const nodes: Node[] = [
  { id: data.center.id, name: data.center.name, group: 'center' },
  ...(data.nodes as Node[]),
]
const links = (data.nodes as Node[]).map((n) => ({ source: n.parent || data.center.id, target: n.id }))

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}

function loadLib(): Promise<any> {
  const w = window as any
  if (w.ForceGraph3D) return Promise.resolve(w.ForceGraph3D)
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = LIB_SRC
    s.integrity = LIB_SRI
    s.crossOrigin = 'anonymous'
    s.async = true
    s.onload = () => (w.ForceGraph3D ? resolve(w.ForceGraph3D) : reject(new Error('missing')))
    s.onerror = () => reject(new Error('load failed'))
    document.head.appendChild(s)
  })
}

// Best-effort reachability check for PUBLIC nodes only. Opaque no-cors fetch:
// resolves => up, network error => down, timeout => unknown.
async function probe(url: string): Promise<Status> {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 6000)
  try {
    await fetch(url, { mode: 'no-cors', cache: 'no-store', signal: ctrl.signal })
    return 'up'
  } catch (e: any) {
    return e?.name === 'AbortError' ? 'unknown' : 'down'
  } finally {
    clearTimeout(t)
  }
}

const STATUS_LABEL: Record<Status, string> = { checking: 'checking…', up: 'up', unknown: 'unknown', down: 'down' }
const STATUS_DOT: Record<Status, string> = { checking: '#6b6963', up: '#5fbf7f', unknown: '#9a978f', down: '#d4573f' }

function tag(n: Node) {
  if (n.group === 'private') return 'Private'
  if (n.group === 'soon') return 'Coming soon'
  if (n.group === 'center') return 'Hub'
  return 'Public'
}

export default function EcosystemGraph() {
  const box = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<'loading' | '3d' | 'list'>('loading')
  const [selected, setSelected] = useState<Node | null>(null)
  const [status, setStatus] = useState<Record<string, Status>>({})

  // Status checks (public only — private nodes have no URL and are never probed).
  useEffect(() => {
    const pub = nodes.filter((n) => n.group === 'public' && n.url)
    const origins = Array.from(new Set(pub.map((n) => new URL(n.url!).origin)))
    setStatus(Object.fromEntries(pub.map((n) => [n.id, 'checking' as Status])))
    origins.forEach(async (o) => {
      const s = await probe(o + '/')
      setStatus((prev) => {
        const next = { ...prev }
        pub.forEach((n) => { if (new URL(n.url!).origin === o) next[n.id] = s })
        return next
      })
    })
  }, [])

  useEffect(() => {
    if (!hasWebGL()) { setMode('list'); return }
    let graph: any
    let ro: ResizeObserver | undefined
    let cancelled = false
    loadLib().then((ForceGraph3D) => {
      if (cancelled || !box.current) return
      const el = box.current
      const small = window.matchMedia('(max-width: 640px)').matches
      graph = ForceGraph3D({ controlType: 'trackball' })(el)
        .width(el.clientWidth)
        .height(el.clientHeight)
        .backgroundColor('rgba(0,0,0,0)')
        .showNavInfo(false)
        .graphData({ nodes: nodes.map((n) => ({ ...n })), links: links.map((l) => ({ ...l })) })
        .nodeLabel((n: Node) => `<div style="font:13px Inter,sans-serif;padding:4px 8px;background:#111;border:1px solid #333;border-radius:6px;color:#eceae4">${n.name} · ${tag(n)}</div>`)
        .nodeColor((n: Node) => COLORS[n.group])
        .nodeVal((n: Node) => (n.group === 'center' ? 14 : n.parent ? 3 : 6))
        .nodeRelSize(small ? 3.5 : 4)
        .nodeResolution(small ? 10 : 16)
        .nodeOpacity(0.95)
        .linkColor(() => 'rgba(236,234,228,0.28)')
        .linkWidth(0.6)
        .linkDirectionalParticles(small ? 0 : 1)
        .linkDirectionalParticleWidth(1.2)
        .cooldownTicks(120)
        .onNodeClick((n: Node) => setSelected(nodes.find((x) => x.id === n.id) || null))
        .onBackgroundClick(() => setSelected(null))
      let fitted = false
      graph.onEngineStop(() => { if (!fitted) { fitted = true; graph.zoomToFit(400, small ? 20 : 40) } })
      graph.cameraPosition({ z: small ? 230 : 190 })
      ro = new ResizeObserver(() => graph.width(el.clientWidth).height(el.clientHeight))
      ro.observe(el)
      setMode('3d')
    }).catch(() => !cancelled && setMode('list'))
    return () => {
      cancelled = true
      ro?.disconnect()
      if (graph) { graph.pauseAnimation(); graph._destructor?.() }
    }
  }, [])

  const dot = (id: string) => {
    const s = status[id]
    if (!s) return null
    return (
      <span className="ml-2 inline-flex items-center gap-1 text-xs text-white/55" title={`Status: ${STATUS_LABEL[s]}`}>
        <span className="inline-block h-2 w-2 rounded-full" style={{ background: STATUS_DOT[s] }} />
        {STATUS_LABEL[s]}
      </span>
    )
  }

  return (
    <section aria-label="Ecosystem map" className="mt-8">
      {mode !== 'list' && (
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(700px_420px_at_50%_40%,rgba(74,168,184,0.12),transparent_60%)]">
          <div ref={box} className="h-[62vh] min-h-[360px] w-full touch-none" />
          {mode === 'loading' && <p className="absolute inset-0 grid place-items-center text-sm text-white/60">Loading map…</p>}
          <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-3 text-xs text-white/70">
            {(['public', 'soon', 'private'] as Group[]).map((g) => (
              <span key={g} className="inline-flex items-center gap-1">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: COLORS[g] }} />
                {g === 'public' ? 'Public' : g === 'soon' ? 'Coming soon' : 'Private'}
              </span>
            ))}
          </div>
          {selected && (
            <div className="absolute bottom-3 left-3 right-3 rounded-lg border border-white/15 bg-[#0d0d10]/95 p-4 sm:right-auto sm:w-80">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">{tag(selected)}</p>
              <p className="mt-1 text-lg font-semibold text-white">{selected.name}{dot(selected.id)}</p>
              {selected.desc && <p className="mt-1 text-sm text-white/70">{selected.desc}</p>}
              {selected.group === 'public' && selected.url ? (
                <a href={selected.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block rounded-md bg-[#eceae4] px-4 py-2 text-sm font-semibold text-[#070708] hover:bg-white">Open site ↗</a>
              ) : selected.group === 'private' ? (
                <p className="mt-2 text-sm text-white/55">Private tool, not publicly accessible.</p>
              ) : null}
              <button onClick={() => setSelected(null)} className="absolute right-3 top-3 text-white/60 hover:text-white" aria-label="Close">×</button>
            </div>
          )}
        </div>
      )}
      {mode === 'list' && <p className="mb-4 text-sm text-white/60">3D view isn’t available on this device, so here’s the list view.</p>}

      <h2 className="display-title mt-10 text-3xl text-white">All properties</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {nodes.filter((n) => n.group !== 'center').map((n) => (
          <li key={n.id} className="glass rounded-lg p-4">
            <p className="text-xs uppercase tracking-[0.2em]" style={{ color: COLORS[n.group] }}>{tag(n)}</p>
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
