'use client'

import { useEffect, useRef } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function SceneCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = prefersReducedMotion()
    let frame = 0
    let raf = 0
    let width = 0
    let height = 0

    const particles = Array.from({ length: reduce ? 40 : 140 }, (_, index) => ({
      a: Math.random() * Math.PI * 2,
      b: Math.acos(2 * Math.random() - 1),
      r: 90 + Math.random() * 170,
      speed: 0.0015 + Math.random() * 0.003,
      size: 0.6 + Math.random() * 1.8,
      hue: index % 3,
    }))

    const field = Array.from({ length: reduce ? 30 : 90 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      v: 0.0004 + Math.random() * 0.0012,
    }))

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      frame += 1
      ctx.clearRect(0, 0, width, height)

      const cx = width * 0.72
      const cy = height * 0.42
      const scroll = typeof window !== 'undefined' ? window.scrollY : 0
      const tilt = Math.min(scroll / 1400, 1)

      ctx.fillStyle = 'rgba(255,255,255,0.55)'
      field.forEach((star) => {
        if (!reduce) star.y -= star.v
        if (star.y < 0) star.y = 1
        const px = star.x * width
        const py = star.y * height
        ctx.globalAlpha = 0.12 + star.z * 0.35
        ctx.fillRect(px, py, star.z * 2, star.z * 2)
      })
      ctx.globalAlpha = 1

      particles.forEach((p) => {
        if (!reduce) p.a += p.speed
        const x = Math.cos(p.a) * Math.sin(p.b) * p.r
        const y = Math.cos(p.b) * p.r
        const z = Math.sin(p.a) * Math.sin(p.b) * p.r
        const perspective = 420 / (420 + z + tilt * 80)
        const sx = cx + x * perspective
        const sy = cy + y * perspective * 0.86
        const colors = ['rgba(46,230,255,', 'rgba(255,45,138,', 'rgba(255,122,24,']
        ctx.fillStyle = `${colors[p.hue]}${0.18 + perspective * 0.55})`
        ctx.beginPath()
        ctx.arc(sx, sy, p.size * perspective * 1.6, 0, Math.PI * 2)
        ctx.fill()
      })

      const pulse = reduce ? 1 : 1 + Math.sin(frame * 0.02) * 0.08
      const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 220 * pulse)
      glow.addColorStop(0, 'rgba(255,255,255,0.55)')
      glow.addColorStop(0.18, 'rgba(46,230,255,0.28)')
      glow.addColorStop(0.42, 'rgba(255,45,138,0.16)')
      glow.addColorStop(1, 'rgba(5,6,10,0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(cx, cy, 220 * pulse, 0, Math.PI * 2)
      ctx.fill()

      raf = window.requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  )
}
