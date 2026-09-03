'use client'

import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

export default function ScrollBackground() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 22, mass: 0.4 })

  const magenta = useTransform(progress, [0, 0.22, 0.4, 1], [0.08, 0.55, 0.12, 0.08])
  const cyan = useTransform(progress, [0, 0.35, 0.55, 1], [0.1, 0.12, 0.5, 0.1])
  const orange = useTransform(progress, [0, 0.62, 0.82, 1], [0.06, 0.1, 0.48, 0.12])
  const veil = useTransform(progress, [0, 0.5, 1], [0.2, 0.38, 0.28])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#05060a]" />
      <motion.div style={{ opacity: magenta }} className="absolute inset-[-10%] bg-[radial-gradient(circle_at_20%_30%,rgba(255,45,138,0.55),transparent_42%)]" />
      <motion.div style={{ opacity: cyan }} className="absolute inset-[-10%] bg-[radial-gradient(circle_at_80%_40%,rgba(46,230,255,0.42),transparent_40%)]" />
      <motion.div style={{ opacity: orange }} className="absolute inset-[-10%] bg-[radial-gradient(circle_at_30%_80%,rgba(255,122,24,0.4),transparent_44%)]" />
      <motion.div style={{ opacity: veil }} className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,10,0.15),rgba(5,6,10,0.72))]" />
      <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(rgba(255,255,255,0.7)_0.7px,transparent_0.7px)] [background-size:28px_28px]" />
    </div>
  )
}
