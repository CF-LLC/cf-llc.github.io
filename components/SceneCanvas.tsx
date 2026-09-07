'use client'

import { useEffect, useRef } from 'react'

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_scroll;
uniform vec2 u_mouse;
uniform float u_reduce;

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
  float t = u_time * (1.0 - u_reduce * 0.9);
  float s = clamp(u_scroll, 0.0, 1.0);
  vec2 m = u_mouse * 0.05;
  float mobile = step(u_res.x / max(u_res.y, 1.0), 0.78);

  vec3 wine = vec3(0.77, 0.23, 0.45);
  vec3 teal = vec3(0.29, 0.66, 0.72);
  vec3 rust = vec3(0.77, 0.42, 0.17);
  vec3 ink = vec3(0.05, 0.055, 0.06);

  vec3 accent = mix(teal, wine, smoothstep(0.08, 0.36, s));
  accent = mix(accent, rust, smoothstep(0.55, 0.82, s));

  vec2 center = mix(vec2(0.52 + m.x, 0.04 + m.y), vec2(0.02, 0.08), mobile);
  center.y += sin(t * 0.12) * 0.015;
  float dist = length(uv - center);
  float orb = 0.014 / (dist + 0.03);
  float halo = exp(-dist * mix(3.2, 1.55, mobile)) * mix(0.4, 0.62, mobile);
  float wash = exp(-length(uv * vec2(1.05, mix(1.0, 0.72, mobile))) * mix(1.4, 0.62, mobile));

  vec3 col = ink;
  col += accent * (orb * 0.5 + halo + wash * mix(0.1, 0.28, mobile));

  float vig = smoothstep(1.55, 0.22, length(uv));
  col *= mix(vig, 0.88 + 0.12 * vig, mobile);
  gl_FragColor = vec4(col, 1.0);
}
`

export default function SceneCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false })
    if (!gl) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const vs = compile(gl.VERTEX_SHADER, VERT)
    const fs = compile(gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(program, 'a_pos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(program, 'u_res')
    const uTime = gl.getUniformLocation(program, 'u_time')
    const uScroll = gl.getUniformLocation(program, 'u_scroll')
    const uMouse = gl.getUniformLocation(program, 'u_mouse')
    const uReduce = gl.getUniformLocation(program, 'u_reduce')

    let raf = 0
    const start = performance.now()
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    const viewport = () => {
      const view = window.visualViewport
      return {
        w: Math.floor(view?.width ?? window.innerWidth),
        h: Math.floor(view?.height ?? window.innerHeight),
      }
    }

    const resize = () => {
      const { w, h } = viewport()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const onMove = (event: MouseEvent) => {
      targetX = event.clientX / window.innerWidth * 2 - 1
      targetY = -(event.clientY / window.innerHeight * 2 - 1)
    }

    const draw = (now: number) => {
      mouseX += (targetX - mouseX) * 0.04
      mouseY += (targetY - mouseY) * 0.04
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, (now - start) / 1000)
      gl.uniform1f(uScroll, window.scrollY / maxScroll)
      gl.uniform2f(uMouse, mouseX, mouseY)
      gl.uniform1f(uReduce, reduce ? 1 : 0)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      raf = window.requestAnimationFrame(draw)
    }

    resize()
    raf = window.requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    window.visualViewport?.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.visualViewport?.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 h-full w-full" aria-hidden="true" />
}
