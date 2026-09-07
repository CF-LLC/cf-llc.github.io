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
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

mat2 rot(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
  float t = u_time * (1.0 - u_reduce * 0.9);
  float s = clamp(u_scroll, 0.0, 1.0);
  vec2 m = u_mouse * 0.22;

  vec3 magenta = vec3(1.0, 0.18, 0.54);
  vec3 cyan = vec3(0.18, 0.90, 1.0);
  vec3 orange = vec3(1.0, 0.48, 0.09);
  vec3 ink = vec3(0.015, 0.018, 0.03);

  vec3 accent = mix(cyan, magenta, smoothstep(0.04, 0.34, s));
  accent = mix(accent, orange, smoothstep(0.5, 0.8, s));

  vec2 p = uv;
  p.x += m.x;
  p.y += m.y;
  p *= rot(s * 0.55 + t * 0.05);
  p.y += s * 0.18;

  vec2 center = vec2(0.38 - s * 0.42, 0.02 + sin(s * 6.283) * 0.12);
  float orb = 0.016 / (length(p - center) + 0.01);
  float halo = exp(-length(p - center) * 2.6) * 0.72;
  float ring = smoothstep(0.28, 0.2, length(p - center)) * smoothstep(0.14, 0.22, length(p - center));

  float field = 0.0;
  for (int i = 0; i < 18; i++) {
    float fi = float(i);
    float ang = fi * 0.35 + t * 0.31 + s * 4.0;
    float rad = 0.16 + 0.08 * sin(fi + t);
    vec3 q = vec3(cos(ang) * rad, sin(ang * 1.3) * rad * 0.72, sin(ang * 0.7) * rad);
    q.xy *= rot(t * 0.2 + s);
    q.xz *= rot(s * 1.4);
    vec2 proj = q.xy / (1.35 + q.z);
    float d = length(p - center - proj);
    field += 0.012 / (d + 0.012);
  }

  vec2 gridUv = p * 7.0;
  gridUv.y += s * 4.0;
  vec2 gv = abs(fract(gridUv) - 0.5);
  float grid = smoothstep(0.46, 0.5, max(gv.x, gv.y)) * 0.16 * (1.0 - s * 0.4);

  float stars = 0.0;
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    vec2 sp = uv * (16.0 + fi * 9.0);
    sp *= rot(0.08 * fi + s * 0.2);
    sp += vec2(t * (0.03 + fi * 0.01), fi * 7.0);
    float n = hash(floor(sp));
    stars += step(0.993 - fi * 0.003, n) * (0.32 - fi * 0.05);
  }

  float mist = noise(p * 2.2 + t * 0.08) * 0.2;
  vec3 col = ink;
  col += accent * (orb * 0.95 + halo + ring * 0.62 + field * 0.55);
  col += mix(cyan, magenta, noise(p + t * 0.05)) * mist;
  col += accent * grid;
  col += vec3(0.9, 0.95, 1.0) * stars;
  col += accent * exp(-length(uv) * 1.15) * 0.16;

  float vig = smoothstep(1.4, 0.28, length(uv));
  col *= vig;
  col = pow(max(col, 0.0), vec3(0.9));
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

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6)
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const onMove = (event: MouseEvent) => {
      targetX = event.clientX / window.innerWidth * 2 - 1
      targetY = -(event.clientY / window.innerHeight * 2 - 1)
    }

    const draw = (now: number) => {
      mouseX += (targetX - mouseX) * 0.06
      mouseY += (targetY - mouseY) * 0.06
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
    window.addEventListener('mousemove', onMove)
    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden="true" />
}
