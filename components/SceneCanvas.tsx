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

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
  float t = u_time * (1.0 - u_reduce * 0.85);
  float s = clamp(u_scroll, 0.0, 1.0);
  vec2 m = u_mouse * 0.08;

  vec3 magenta = vec3(1.0, 0.18, 0.54);
  vec3 cyan = vec3(0.18, 0.90, 1.0);
  vec3 orange = vec3(1.0, 0.48, 0.09);
  vec3 ink = vec3(0.02, 0.03, 0.05);

  vec3 accent = mix(cyan, magenta, smoothstep(0.08, 0.38, s));
  accent = mix(accent, orange, smoothstep(0.55, 0.82, s));

  vec2 center = vec2(0.52 + m.x, 0.04 + m.y);
  float dist = length(uv - center);
  float orb = 0.018 / (dist + 0.02);
  float halo = exp(-dist * 2.8) * 0.55;
  float ring = smoothstep(0.24, 0.18, dist) * smoothstep(0.12, 0.2, dist) * 0.45;

  float mist = noise(uv * 1.6 + t * 0.04) * 0.12;
  vec3 col = ink;
  col += accent * (orb * 0.85 + halo + ring);
  col += accent * mist * 0.35;
  col += accent * exp(-length(uv) * 1.4) * 0.12;

  float vig = smoothstep(1.35, 0.35, length(uv));
  col *= vig;
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
      mouseX += (targetX - mouseX) * 0.05
      mouseY += (targetY - mouseY) * 0.05
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
