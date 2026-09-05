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
uniform float u_reduce;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
  float t = u_time * (1.0 - u_reduce * 0.85);
  float s = clamp(u_scroll, 0.0, 1.0);

  vec3 magenta = vec3(1.0, 0.18, 0.54);
  vec3 cyan = vec3(0.18, 0.90, 1.0);
  vec3 orange = vec3(1.0, 0.48, 0.09);
  vec3 ink = vec3(0.02, 0.024, 0.04);

  vec3 accent = mix(cyan, magenta, smoothstep(0.05, 0.32, s));
  accent = mix(accent, orange, smoothstep(0.48, 0.78, s));

  vec2 center = vec2(0.42 - s * 0.18, 0.08 + sin(s * 3.14) * 0.06);
  if (u_reduce > 0.5) center = vec2(0.38, 0.06);

  float r = length(uv - center);
  float orb = 0.018 / (r + 0.012);
  float halo = exp(-r * 3.2) * 0.65;
  float ring = smoothstep(0.22, 0.16, r) * smoothstep(0.12, 0.18, r);
  float swirl = noise((uv - center) * 6.0 + vec2(t * 0.15, -t * 0.08));
  float mist = noise(uv * 2.4 + t * 0.05) * 0.18;

  float stars = 0.0;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    vec2 p = uv * (18.0 + fi * 10.0) + vec2(t * (0.02 + fi * 0.01), fi * 12.0);
    float n = hash(floor(p));
    stars += step(0.992 - fi * 0.004, n) * (0.35 - fi * 0.08);
  }

  vec3 col = ink;
  col += accent * (orb * 0.85 + halo + ring * 0.55);
  col += mix(cyan, magenta, swirl) * mist * 0.55;
  col += vec3(0.85, 0.92, 1.0) * stars;
  col += accent * exp(-length(uv) * 1.4) * 0.12;

  float vig = smoothstep(1.35, 0.35, length(uv));
  col *= vig;
  col = pow(col, vec3(0.92));
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
    const uReduce = gl.getUniformLocation(program, 'u_reduce')

    let raf = 0
    const start = performance.now()

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      const width = window.innerWidth
      const height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const draw = (now: number) => {
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      const scroll = window.scrollY / maxScroll
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, (now - start) / 1000)
      gl.uniform1f(uScroll, scroll)
      gl.uniform1f(uReduce, reduce ? 1 : 0)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      raf = window.requestAnimationFrame(draw)
    }

    resize()
    raf = window.requestAnimationFrame(draw)
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
