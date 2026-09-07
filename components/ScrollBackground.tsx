'use client'

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'

export default function ScrollBackground() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 50, damping: 26, mass: 0.5 })

  const magenta = useTransform(progress, [0, 0.22, 0.42, 1], [0.04, 0.28, 0.06, 0.04])
  const cyan = useTransform(progress, [0, 0.36, 0.56, 1], [0.08, 0.08, 0.26, 0.05])
  const orange = useTransform(progress, [0, 0.64, 0.82, 1], [0.03, 0.05, 0.24, 0.06])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#070708]" />
      {!reduce && (
        <>
          <motion.div style={{ opacity: magenta }} className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(196,59,114,0.4),transparent_46%)]" />
          <motion.div style={{ opacity: cyan }} className="absolute inset-0 bg-[radial-gradient(circle_at_82%_38%,rgba(74,168,184,0.32),transparent_44%)]" />
          <motion.div style={{ opacity: orange }} className="absolute inset-0 bg-[radial-gradient(circle_at_28%_84%,rgba(197,106,43,0.28),transparent_46%)]" />
        </>
      )}
    </div>
  )
}
