import { motion, useAnimation } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { playSpinStart, playTick, playWin } from '../lib/sound'

type Props = {
  min: number
  max: number
  result: number | null
  onSpinEnd: (value: number) => void
  onSpinStart?: () => void
  trigger: number // increment to start a new spin
  externalResult?: number | null
  onClick?: () => void
  disabled?: boolean
}

/**
 * Wheel-of-fortune style spinner. Segments are min..max inclusive.
 * Parent passes a target value via `result` (null => component picks one),
 * triggers a spin by bumping `trigger`.
 */
export function SlotMachine({ min, max, result, onSpinEnd, onSpinStart, trigger, onClick, disabled }: Props) {
  const segCount = Math.max(1, max - min + 1)
  const segAngle = 360 / segCount
  const controls = useAnimation()
  const [spinning, setSpinning] = useState(false)
  const [shown, setShown] = useState<number | null>(null)
  const totalRotation = useRef(0)
  const lastTrigger = useRef(0)
  const lastTickIdx = useRef(0)

  useEffect(() => {
    if (trigger === 0 || trigger === lastTrigger.current) return
    lastTrigger.current = trigger
    void start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])

  async function start() {
    if (spinning) return
    setSpinning(true)
    setShown(null)
    onSpinStart?.()
    playSpinStart()

    const value = result ?? min + Math.floor(Math.random() * segCount)
    const idx = value - min
    // Pointer is at top (12 o'clock). Segment 0 is centered at top initially.
    // Rotation should land so that segment idx is at top:
    // We rotate by N * 360 + (-idx * segAngle) (since rotating CW by segAngle moves seg 1 to top).
    const turns = 6
    const target = turns * 360 + (360 - idx * segAngle)
    lastTickIdx.current = Math.floor(totalRotation.current / segAngle)
    totalRotation.current += target

    await controls.start({
      rotate: totalRotation.current,
      transition: { duration: 4, ease: [0.17, 0.67, 0.32, 1] },
    })

    setShown(value)
    setSpinning(false)
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#ff6fa3', '#b760ff', '#5ec8ff', '#ffd64a', '#5fe0a8'],
    })
    playWin()
    onSpinEnd(value)
  }

  const handleRotateUpdate = (latest: number) => {
    const idx = Math.floor(latest / segAngle)
    if (idx > lastTickIdx.current) {
      lastTickIdx.current = idx
      playTick()
    }
  }

  // Pretty colors per segment
  const colors = [
    '#ff6fa3',
    '#b760ff',
    '#5ec8ff',
    '#ffd64a',
    '#5fe0a8',
    '#ff995c',
  ]

  // Build SVG slices
  const radius = 180
  const cx = 200
  const cy = 200
  const slices = Array.from({ length: segCount }).map((_, i) => {
    const startA = i * segAngle - 90 - segAngle / 2
    const endA = startA + segAngle
    const sx = cx + radius * Math.cos((startA * Math.PI) / 180)
    const sy = cy + radius * Math.sin((startA * Math.PI) / 180)
    const ex = cx + radius * Math.cos((endA * Math.PI) / 180)
    const ey = cy + radius * Math.sin((endA * Math.PI) / 180)
    const largeArc = segAngle > 180 ? 1 : 0
    const d = `M${cx},${cy} L${sx},${sy} A${radius},${radius} 0 ${largeArc} 1 ${ex},${ey} Z`
    const labelA = i * segAngle - 90
    const lx = cx + radius * 0.62 * Math.cos((labelA * Math.PI) / 180)
    const ly = cy + radius * 0.62 * Math.sin((labelA * Math.PI) / 180)
    return {
      d,
      color: colors[i % colors.length],
      label: String(min + i),
      lx,
      ly,
      labelA,
    }
  })

  const clickable = !!onClick && !disabled && !spinning
  const handleClick = () => {
    if (!clickable) return
    onClick?.()
  }

  return (
    <div
      className={`relative w-[360px] h-[360px] sm:w-[420px] sm:h-[420px] select-none ${
        clickable ? 'cursor-pointer' : disabled ? 'cursor-not-allowed' : ''
      }`}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      aria-disabled={onClick ? !clickable : undefined}
    >
      {/* Pointer */}
      <div className="absolute left-1/2 -top-2 -translate-x-1/2 z-10 text-5xl drop-shadow-lg">
        🔻
      </div>

      <motion.svg
        viewBox="0 0 400 400"
        className="w-full h-full drop-shadow-2xl"
        animate={controls}
        onUpdate={(latest) => {
          const r = latest.rotate
          if (typeof r === 'number') handleRotateUpdate(r)
        }}
        style={{ originX: '50%', originY: '50%' }}
      >
        <circle cx={cx} cy={cy} r={radius + 10} fill="#2b1b3d" />
        {slices.map((s, i) => (
          <g key={i}>
            <path d={s.d} fill={s.color} stroke="#fff" strokeWidth={3} />
            <text
              x={s.lx}
              y={s.ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="44"
              fontWeight="800"
              fontFamily="Baloo 2, sans-serif"
              fill="#fff"
              transform={`rotate(${s.labelA + 90} ${s.lx} ${s.ly})`}
            >
              {s.label}
            </text>
          </g>
        ))}
        <circle cx={cx} cy={cy} r={28} fill="#fff" stroke="#2b1b3d" strokeWidth={4} />
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="34"
        >
          ⭐
        </text>
      </motion.svg>

      {shown !== null && !spinning && (
        <motion.div
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 14 }}
          className="absolute inset-x-0 -bottom-20 text-center pointer-events-none"
        >
          <div className="inline-block bg-white rounded-full px-8 py-3 shadow-toy">
            <span className="text-3xl font-display font-extrabold text-candy-pink">
              +{shown} ⭐
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
