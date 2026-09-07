'use client'

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'

export default function ScrollBackground() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 46, damping: 28, mass: 0.55 })

  const wine = useTransform(progress, [0, 0.2, 0.4, 1], [0.03, 0.32, 0.05, 0.03])
  const teal = useTransform(progress, [0, 0.34, 0.54, 1], [0.1, 0.08, 0.3, 0.04])
  const rust = useTransform(progress, [0, 0.62, 0.8, 1], [0.02, 0.04, 0.28, 0.05])

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden mix-blend-screen">
      {!reduce && (
        <>
          <motion.div style={{ opacity: wine }} className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_24%,rgba(196,59,114,0.55),transparent_48%)]" />
          <motion.div style={{ opacity: teal }} className="absolute inset-0 bg-[radial-gradient(ellipse_at_84%_36%,rgba(74,168,184,0.42),transparent_46%)]" />
          <motion.div style={{ opacity: rust }} className="absolute inset-0 bg-[radial-gradient(ellipse_at_24%_86%,rgba(197,106,43,0.38),transparent_48%)]" />
        </>
      )}
    </div>
  )
}
