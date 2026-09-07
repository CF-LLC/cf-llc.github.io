'use client'

import { ReactNode, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'

type SpatialSceneProps = {
  children: ReactNode
  className?: string
  id?: string
  fromX?: number
  fromY?: number
  fromZ?: number
  fromRotateX?: number
  fromRotateY?: number
  fromRotateZ?: number
}

export default function SpatialScene({
  children,
  className = '',
  id,
  fromX = 80,
  fromY = 90,
  fromZ = -280,
  fromRotateX = 14,
  fromRotateY = -16,
  fromRotateZ = 4,
}: SpatialSceneProps) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.35 })

  const x = useTransform(progress, [0, 0.35, 0.65, 1], [fromX, 0, 0, -fromX * 0.4])
  const y = useTransform(progress, [0, 0.35, 0.65, 1], [fromY, 0, 0, -40])
  const z = useTransform(progress, [0, 0.35, 0.65, 1], [fromZ, 0, 0, -120])
  const rotateX = useTransform(progress, [0, 0.35, 0.65, 1], [fromRotateX, 0, 0, -8])
  const rotateY = useTransform(progress, [0, 0.35, 0.65, 1], [fromRotateY, 0, 0, fromRotateY * -0.4])
  const rotateZ = useTransform(progress, [0, 0.35, 0.65, 1], [fromRotateZ, 0, 0, -2])
  const opacity = useTransform(progress, [0, 0.18, 0.82, 1], [0.15, 1, 1, 0.35])
  const scale = useTransform(progress, [0, 0.35, 0.65, 1], [0.86, 1, 1, 0.94])

  return (
    <section ref={ref} id={id} className={`spatial-scene ${className}`}>
      <motion.div
        style={reduce ? undefined : { x, y, z, rotateX, rotateY, rotateZ, opacity, scale }}
        className="spatial-scene-inner"
      >
        {children}
      </motion.div>
    </section>
  )
}
