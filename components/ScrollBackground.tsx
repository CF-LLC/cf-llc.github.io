'use client'

import { motion, useScroll, useTransform } from 'framer-motion'

export default function ScrollBackground() {
  const { scrollYProgress } = useScroll()

  const orbOneY = useTransform(scrollYProgress, [0, 1], ['-4%', '22%'])
  const orbOneX = useTransform(scrollYProgress, [0, 1], ['-8%', '12%'])
  const orbOneScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.28, 0.92])
  const orbOneRadius = useTransform(scrollYProgress, [0, 0.5, 1], ['38% 62% 44% 56%', '61% 39% 57% 43%', '45% 55% 37% 63%'])

  const orbTwoY = useTransform(scrollYProgress, [0, 1], ['8%', '42%'])
  const orbTwoX = useTransform(scrollYProgress, [0, 1], ['74%', '58%'])
  const orbTwoRotate = useTransform(scrollYProgress, [0, 1], [0, 120])
  const orbTwoScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.88, 1.16, 1.34])

  const orbThreeY = useTransform(scrollYProgress, [0, 1], ['72%', '50%'])
  const orbThreeX = useTransform(scrollYProgress, [0, 1], ['14%', '6%'])
  const orbThreeRotate = useTransform(scrollYProgress, [0, 1], [0, -95])
  const orbThreeScale = useTransform(scrollYProgress, [0, 1], [1, 0.92])

  const gridOpacity = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [0.2, 0.4, 0.26, 0.14])
  const beamRotate = useTransform(scrollYProgress, [0, 1], ['-12deg', '12deg'])
  const beamScale = useTransform(scrollYProgress, [0, 1], [1, 1.35])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        style={{ opacity: gridOpacity }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(123,204,255,0.18),transparent_38%),radial-gradient(circle_at_80%_20%,rgba(67,132,255,0.12),transparent_26%),linear-gradient(rgba(118,184,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(118,184,255,0.08)_1px,transparent_1px)] bg-[length:auto,auto,88px_88px,88px_88px]"
      />

      <motion.div
        style={{ y: orbOneY, x: orbOneX, scale: orbOneScale, borderRadius: orbOneRadius }}
        className="absolute h-[36rem] w-[36rem] bg-[radial-gradient(circle_at_30%_30%,rgba(131,224,255,0.56),rgba(33,123,255,0.2)_58%,transparent_74%)] blur-3xl"
      />

      <motion.div
        style={{ y: orbTwoY, x: orbTwoX, rotate: orbTwoRotate, scale: orbTwoScale }}
        className="absolute h-[32rem] w-[32rem] rounded-[38%_62%_56%_44%] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(101,189,255,0.28),rgba(18,73,173,0.12),rgba(97,214,255,0.34),rgba(101,189,255,0.28))] blur-3xl"
      />

      <motion.div
        style={{ y: orbThreeY, x: orbThreeX, rotate: orbThreeRotate, scale: orbThreeScale }}
        className="absolute h-[30rem] w-[38rem] rounded-[56%_44%_42%_58%] bg-[radial-gradient(circle_at_60%_40%,rgba(81,169,255,0.32),rgba(8,34,70,0.1)_52%,transparent_72%)] blur-3xl"
      />

      <motion.div
        style={{ rotate: beamRotate, scale: beamScale }}
        className="absolute left-1/2 top-[-10%] h-[140%] w-[42rem] -translate-x-1/2 bg-[linear-gradient(180deg,transparent,rgba(112,192,255,0.08),transparent)] blur-2xl"
      />
    </div>
  )
}