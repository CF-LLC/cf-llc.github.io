'use client'

import { motion, useMotionTemplate, useScroll, useSpring, useTransform } from 'framer-motion'

const pulseNodes = [
  {
    className: 'left-[8%] top-[16%] h-40 w-40 border-sky-300/20 bg-sky-300/10',
    x: ['-4%', '10%'],
    y: ['-8%', '14%'],
    scale: [0.8, 1.25],
  },
  {
    className: 'right-[10%] top-[18%] h-28 w-28 border-cyan-200/20 bg-cyan-200/10',
    x: ['6%', '-12%'],
    y: ['-10%', '18%'],
    scale: [0.9, 1.4],
  },
  {
    className: 'left-[14%] bottom-[16%] h-36 w-36 border-blue-300/15 bg-blue-300/10',
    x: ['-6%', '18%'],
    y: ['10%', '-8%'],
    scale: [0.75, 1.2],
  },
  {
    className: 'right-[18%] bottom-[12%] h-44 w-44 border-sky-100/15 bg-sky-100/10',
    x: ['10%', '-16%'],
    y: ['12%', '-14%'],
    scale: [0.85, 1.35],
  },
  {
    className: 'left-[42%] top-[10%] h-24 w-24 border-blue-200/20 bg-blue-200/10',
    x: ['-8%', '14%'],
    y: ['-6%', '24%'],
    scale: [0.8, 1.28],
  },
  {
    className: 'right-[34%] bottom-[10%] h-32 w-32 border-sky-300/20 bg-sky-300/10',
    x: ['12%', '-18%'],
    y: ['8%', '-10%'],
    scale: [0.88, 1.3],
  },
]

export default function ScrollBackground() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.35,
  })

  const stageRotate = useTransform(progress, [0, 0.35, 0.7, 1], [-8, -2, 7, 14])
  const stageScale = useTransform(progress, [0, 0.5, 1], [1.14, 1.02, 1.18])
  const veilOpacity = useTransform(progress, [0, 0.45, 1], [0.48, 0.72, 0.5])

  const gridY = useTransform(progress, [0, 1], ['0%', '18%'])
  const gridRotateX = useTransform(progress, [0, 1], ['74deg', '58deg'])
  const gridScale = useTransform(progress, [0, 0.5, 1], [1.2, 1.05, 1.28])
  const gridOpacity = useTransform(progress, [0, 0.3, 0.75, 1], [0.2, 0.34, 0.18, 0.28])

  const contourScale = useTransform(progress, [0, 1], [1, 1.26])
  const contourRotate = useTransform(progress, [0, 1], [-12, 18])
  const contourOpacity = useTransform(progress, [0, 0.5, 1], [0.14, 0.28, 0.18])

  const auroraOneX = useTransform(progress, [0, 1], ['-10%', '18%'])
  const auroraOneY = useTransform(progress, [0, 1], ['-14%', '28%'])
  const auroraOneScale = useTransform(progress, [0, 0.5, 1], [0.96, 1.26, 1.04])
  const auroraOneRotate = useTransform(progress, [0, 1], [-12, 42])
  const auroraOneRadius = useTransform(progress, [0, 0.5, 1], ['42% 58% 54% 46%', '62% 38% 34% 66%', '46% 54% 61% 39%'])
  const auroraOneClip = useTransform(progress, [0, 0.5, 1], [
    'polygon(8% 18%, 88% 6%, 96% 76%, 18% 92%)',
    'polygon(4% 12%, 94% 18%, 86% 88%, 12% 82%)',
    'polygon(10% 4%, 96% 28%, 74% 94%, 4% 70%)',
  ])

  const auroraTwoX = useTransform(progress, [0, 1], ['12%', '-16%'])
  const auroraTwoY = useTransform(progress, [0, 1], ['10%', '36%'])
  const auroraTwoScale = useTransform(progress, [0, 0.5, 1], [0.92, 1.18, 1.32])
  const auroraTwoRotate = useTransform(progress, [0, 1], [8, -58])
  const auroraTwoRadius = useTransform(progress, [0, 0.5, 1], ['56% 44% 33% 67%', '34% 66% 62% 38%', '58% 42% 48% 52%'])
  const auroraTwoClip = useTransform(progress, [0, 0.5, 1], [
    'polygon(10% 10%, 100% 18%, 82% 100%, 4% 80%)',
    'polygon(18% 2%, 100% 32%, 70% 100%, 0% 74%)',
    'polygon(4% 20%, 92% 0%, 100% 92%, 20% 100%)',
  ])

  const auroraThreeX = useTransform(progress, [0, 1], ['-6%', '10%'])
  const auroraThreeY = useTransform(progress, [0, 1], ['58%', '34%'])
  const auroraThreeScale = useTransform(progress, [0, 1], [1.06, 0.9])
  const auroraThreeRotate = useTransform(progress, [0, 1], [-18, 26])
  const auroraThreeRadius = useTransform(progress, [0, 0.5, 1], ['48% 52% 58% 42%', '63% 37% 40% 60%', '39% 61% 52% 48%'])

  const coreRotate = useTransform(progress, [0, 1], [0, 180])
  const coreScale = useTransform(progress, [0, 0.5, 1], [0.9, 1.16, 1.08])
  const coreOpacity = useTransform(progress, [0, 0.5, 1], [0.28, 0.44, 0.32])

  const ribbonOneX = useTransform(progress, [0, 1], ['-14%', '12%'])
  const ribbonOneY = useTransform(progress, [0, 1], ['-8%', '18%'])
  const ribbonOneRotate = useTransform(progress, [0, 1], [-24, 36])

  const ribbonTwoX = useTransform(progress, [0, 1], ['18%', '-10%'])
  const ribbonTwoY = useTransform(progress, [0, 1], ['16%', '38%'])
  const ribbonTwoRotate = useTransform(progress, [0, 1], [28, -26])

  const scanlineY = useTransform(progress, [0, 1], ['-12%', '22%'])
  const scanlineOpacity = useTransform(progress, [0, 0.5, 1], [0.18, 0.34, 0.22])

  const waveOneX = useTransform(progress, [0, 1], ['-18%', '16%'])
  const waveOneY = useTransform(progress, [0, 1], ['28%', '6%'])
  const waveOneRotate = useTransform(progress, [0, 1], [-20, 26])

  const waveTwoX = useTransform(progress, [0, 1], ['16%', '-14%'])
  const waveTwoY = useTransform(progress, [0, 1], ['62%', '42%'])
  const waveTwoRotate = useTransform(progress, [0, 1], [24, -34])

  const prismOneX = useTransform(progress, [0, 1], ['8%', '-10%'])
  const prismOneY = useTransform(progress, [0, 1], ['-12%', '20%'])
  const prismOneRotate = useTransform(progress, [0, 1], [0, 34])
  const prismOneOpacity = useTransform(progress, [0, 0.5, 1], [0.14, 0.26, 0.18])

  const prismTwoX = useTransform(progress, [0, 1], ['-8%', '14%'])
  const prismTwoY = useTransform(progress, [0, 1], ['36%', '10%'])
  const prismTwoRotate = useTransform(progress, [0, 1], [-8, 30])
  const prismTwoOpacity = useTransform(progress, [0, 0.5, 1], [0.1, 0.22, 0.16])

  const atmosphereOneY = useTransform(progress, [0, 1], ['12%', '38%'])
  const atmosphereTwoY = useTransform(progress, [0, 1], ['18%', '56%'])
  const atmosphereThreeY = useTransform(progress, [0, 1], ['70%', '30%'])

  const nodeOneX = useTransform(progress, [0, 1], pulseNodes[0].x)
  const nodeOneY = useTransform(progress, [0, 1], pulseNodes[0].y)
  const nodeOneScale = useTransform(progress, [0, 1], pulseNodes[0].scale)

  const nodeTwoX = useTransform(progress, [0, 1], pulseNodes[1].x)
  const nodeTwoY = useTransform(progress, [0, 1], pulseNodes[1].y)
  const nodeTwoScale = useTransform(progress, [0, 1], pulseNodes[1].scale)

  const nodeThreeX = useTransform(progress, [0, 1], pulseNodes[2].x)
  const nodeThreeY = useTransform(progress, [0, 1], pulseNodes[2].y)
  const nodeThreeScale = useTransform(progress, [0, 1], pulseNodes[2].scale)

  const nodeFourX = useTransform(progress, [0, 1], pulseNodes[3].x)
  const nodeFourY = useTransform(progress, [0, 1], pulseNodes[3].y)
  const nodeFourScale = useTransform(progress, [0, 1], pulseNodes[3].scale)

  const nodeFiveX = useTransform(progress, [0, 1], pulseNodes[4].x)
  const nodeFiveY = useTransform(progress, [0, 1], pulseNodes[4].y)
  const nodeFiveScale = useTransform(progress, [0, 1], pulseNodes[4].scale)

  const nodeSixX = useTransform(progress, [0, 1], pulseNodes[5].x)
  const nodeSixY = useTransform(progress, [0, 1], pulseNodes[5].y)
  const nodeSixScale = useTransform(progress, [0, 1], pulseNodes[5].scale)

  const backgroundNodes = [
    { className: pulseNodes[0].className, x: nodeOneX, y: nodeOneY, scale: nodeOneScale },
    { className: pulseNodes[1].className, x: nodeTwoX, y: nodeTwoY, scale: nodeTwoScale },
    { className: pulseNodes[2].className, x: nodeThreeX, y: nodeThreeY, scale: nodeThreeScale },
    { className: pulseNodes[3].className, x: nodeFourX, y: nodeFourY, scale: nodeFourScale },
    { className: pulseNodes[4].className, x: nodeFiveX, y: nodeFiveY, scale: nodeFiveScale },
    { className: pulseNodes[5].className, x: nodeSixX, y: nodeSixY, scale: nodeSixScale },
  ]

  const atmosphere = useMotionTemplate`radial-gradient(circle at 18% ${atmosphereOneY}, rgba(146, 222, 255, 0.18), transparent 24%), radial-gradient(circle at 82% ${atmosphereTwoY}, rgba(73, 151, 255, 0.22), transparent 26%), radial-gradient(circle at 50% ${atmosphereThreeY}, rgba(51, 119, 255, 0.2), transparent 28%), radial-gradient(circle at 66% 14%, rgba(64, 156, 255, 0.12), transparent 34%), linear-gradient(180deg, rgba(3, 11, 26, 0.1), rgba(3, 10, 24, 0.8))`

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        style={{ backgroundImage: atmosphere }}
        className="absolute inset-0"
      />

      <motion.div
        style={{ rotate: stageRotate, scale: stageScale, opacity: veilOpacity }}
        className="absolute inset-[-18%]"
      >
        <motion.div
          style={{ y: gridY, rotateX: gridRotateX, scale: gridScale, opacity: gridOpacity }}
          className="absolute inset-x-[-8%] bottom-[-38%] top-[42%] bg-[linear-gradient(rgba(143,212,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(143,212,255,0.14)_1px,transparent_1px)] bg-[length:100px_100px] [transform-style:preserve-3d]"
        />

        <motion.div
          style={{ scale: contourScale, rotate: contourRotate, opacity: contourOpacity }}
          className="absolute inset-[-12%] rounded-full bg-[repeating-radial-gradient(circle_at_center,rgba(175,228,255,0.18)_0,rgba(175,228,255,0.18)_2px,transparent_2px,transparent_34px)] blur-[1px]"
        />

        <motion.div
          style={{ x: auroraOneX, y: auroraOneY, scale: auroraOneScale, rotate: auroraOneRotate, borderRadius: auroraOneRadius, clipPath: auroraOneClip }}
          className="absolute left-[-6%] top-[-6%] h-[44rem] w-[44rem] bg-[radial-gradient(circle_at_28%_26%,rgba(163,234,255,0.62),rgba(61,138,255,0.28)_42%,rgba(13,30,70,0.02)_70%,transparent_78%)] blur-3xl"
        />

        <motion.div
          style={{ x: auroraTwoX, y: auroraTwoY, scale: auroraTwoScale, rotate: auroraTwoRotate, borderRadius: auroraTwoRadius, clipPath: auroraTwoClip }}
          className="absolute right-[-10%] top-[0%] h-[42rem] w-[42rem] bg-[conic-gradient(from_210deg_at_50%_50%,rgba(142,230,255,0.08),rgba(46,116,255,0.34),rgba(84,221,255,0.22),rgba(22,43,110,0.05),rgba(142,230,255,0.08))] blur-3xl"
        />

        <motion.div
          style={{ x: auroraThreeX, y: auroraThreeY, scale: auroraThreeScale, rotate: auroraThreeRotate, borderRadius: auroraThreeRadius }}
          className="absolute left-[10%] h-[34rem] w-[58rem] bg-[radial-gradient(circle_at_50%_42%,rgba(103,174,255,0.3),rgba(8,27,71,0.06)_52%,transparent_74%)] blur-3xl"
        />

        <motion.div
          style={{ rotate: coreRotate, scale: coreScale, opacity: coreOpacity }}
          className="absolute left-1/2 top-[14%] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-[conic-gradient(from_90deg_at_50%_50%,rgba(169,241,255,0.26),rgba(72,140,255,0.04),rgba(169,241,255,0.3),rgba(10,29,74,0.04),rgba(169,241,255,0.26))] blur-2xl"
        />

        <motion.div
          style={{ x: ribbonOneX, y: ribbonOneY, rotate: ribbonOneRotate }}
          className="absolute left-[-8%] top-[8%] h-[12rem] w-[88rem] bg-[linear-gradient(90deg,transparent,rgba(145,233,255,0.08),rgba(77,133,255,0.22),transparent)] blur-2xl"
        />

        <motion.div
          style={{ x: ribbonTwoX, y: ribbonTwoY, rotate: ribbonTwoRotate }}
          className="absolute right-[-14%] top-[36%] h-[10rem] w-[78rem] bg-[linear-gradient(90deg,transparent,rgba(99,194,255,0.06),rgba(23,96,255,0.18),transparent)] blur-2xl"
        />

        <motion.div
          style={{ y: scanlineY, opacity: scanlineOpacity }}
          className="absolute inset-x-0 top-[-10%] h-[60%] bg-[linear-gradient(180deg,transparent,rgba(166,230,255,0.12),transparent)] blur-3xl"
        />

        <motion.div
          style={{ x: waveOneX, y: waveOneY, rotate: waveOneRotate }}
          className="absolute left-[-20%] top-[18%] h-[18rem] w-[110rem] bg-[linear-gradient(90deg,transparent,rgba(114,205,255,0.12),rgba(30,114,255,0.26),rgba(114,205,255,0.08),transparent)] blur-3xl"
        />

        <motion.div
          style={{ x: waveTwoX, y: waveTwoY, rotate: waveTwoRotate }}
          className="absolute right-[-24%] top-[44%] h-[16rem] w-[96rem] bg-[linear-gradient(90deg,transparent,rgba(142,226,255,0.1),rgba(43,124,255,0.22),rgba(142,226,255,0.08),transparent)] blur-3xl"
        />

        <motion.div
          style={{ x: prismOneX, y: prismOneY, rotate: prismOneRotate, opacity: prismOneOpacity }}
          className="absolute left-[2%] top-[8%] h-[26rem] w-[26rem] bg-[conic-gradient(from_120deg_at_50%_50%,rgba(176,241,255,0.2),rgba(67,135,255,0.06),rgba(115,220,255,0.24),rgba(22,69,174,0.08),rgba(176,241,255,0.2))] [clip-path:polygon(50%_0%,100%_36%,82%_100%,18%_100%,0%_36%)] blur-2xl"
        />

        <motion.div
          style={{ x: prismTwoX, y: prismTwoY, rotate: prismTwoRotate, opacity: prismTwoOpacity }}
          className="absolute right-[8%] top-[22%] h-[22rem] w-[30rem] bg-[radial-gradient(circle_at_30%_38%,rgba(169,232,255,0.2),rgba(52,125,255,0.16)_45%,transparent_72%)] [clip-path:polygon(12%_12%,100%_0%,86%_84%,0%_100%)] blur-2xl"
        />

        {backgroundNodes.map((node, index) => (
          <motion.div
            key={index}
            style={{ x: node.x, y: node.y, scale: node.scale }}
            className={`absolute rounded-full border blur-xl ${node.className}`}
          />
        ))}
      </motion.div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(199,239,255,0.12),transparent_18%),radial-gradient(circle_at_80%_10%,rgba(80,157,255,0.16),transparent_24%),radial-gradient(circle_at_bottom,rgba(9,29,74,0.22),transparent_52%)] mix-blend-screen" />

      <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(rgba(220,245,255,0.6)_0.8px,transparent_0.8px)] [background-size:26px_26px]" />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,8,20,0.04),rgba(3,8,20,0.28)_40%,rgba(2,6,16,0.62))]" />
    </div>
  )
}