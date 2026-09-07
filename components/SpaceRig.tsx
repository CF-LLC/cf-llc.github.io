'use client'

import { ReactNode, useEffect } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

export default function SpaceRig({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rotateY = useSpring(rawX, { stiffness: 60, damping: 20 })
  const rotateX = useSpring(rawY, { stiffness: 60, damping: 20 })

  useEffect(() => {
    if (reduce) return
    const onMove = (event: MouseEvent) => {
      const nx = (event.clientX / window.innerWidth - 0.5) * 8
      const ny = (event.clientY / window.innerHeight - 0.5) * -6
      rawX.set(nx)
      rawY.set(ny)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [rawX, rawY, reduce])

  return (
    <motion.div className="space-rig" style={reduce ? undefined : { rotateX, rotateY }}>
      {children}
    </motion.div>
  )
}
