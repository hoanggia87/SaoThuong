import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store'
import { Button } from '../components/Button'
import { SlotMachine } from '../components/SlotMachine'
import { randInt } from '../lib/random'
import { useT } from '../i18n'

type Props = {
  kidId: string
  onBack: () => void
}

export function Spin({ kidId, onBack }: Props) {
  const kid = useStore((s) => s.kids.find((k) => k.id === kidId))
  const settings = useStore((s) => s.settings)
  const consume = useStore((s) => s.consumeSpin)
  const [trigger, setTrigger] = useState(0)
  const [result, setResult] = useState<number | null>(null)
  const [spinning, setSpinning] = useState(false)
  const { dict } = useT()

  if (!kid) return null

  const startSpin = () => {
    if (kid.pendingSpins <= 0 || spinning) return
    const value = randInt(settings.minStars, settings.maxStars)
    setResult(value)
    setSpinning(true)
    setTrigger((t) => t + 1)
  }

  const onSpinEnd = (val: number) => {
    consume(kidId, val)
    setSpinning(false)
  }

  return (
    <div className="min-h-full flex flex-col p-4 sm:p-10 overflow-y-auto">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <Button variant="gray" size="sm" onClick={onBack}>
          {dict.common.back}
        </Button>
        <h1 className="text-xl sm:text-4xl font-display font-extrabold flex-1 truncate">
          {dict.spin.title}
        </h1>
      </div>

      <div className="flex flex-col items-center gap-4 sm:gap-6 flex-1 justify-center">
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="bg-white rounded-2xl px-4 py-2 sm:px-5 sm:py-3 shadow-toy-sm">
            <span className="text-slate-500 text-xs sm:text-sm block">{dict.spin.remainingSpins}</span>
            <span className="text-2xl sm:text-3xl font-display font-extrabold text-candy-pink">
              {kid.pendingSpins}
            </span>
          </div>
          <div className="bg-white rounded-2xl px-4 py-2 sm:px-5 sm:py-3 shadow-toy-sm">
            <span className="text-slate-500 text-xs sm:text-sm block">{dict.spin.totalStars}</span>
            <span className="text-2xl sm:text-3xl font-display font-extrabold text-candy-yellow">
              {kid.totalStars} ⭐
            </span>
          </div>
        </div>

        <motion.div
          className="my-4 sm:my-10"
          animate={kid.pendingSpins > 0 && !spinning ? { scale: [1, 1.03, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.6 }}
        >
          <SlotMachine
            min={settings.minStars}
            max={settings.maxStars}
            result={result}
            trigger={trigger}
            onSpinEnd={onSpinEnd}
            onClick={startSpin}
            disabled={kid.pendingSpins === 0 || spinning}
          />
        </motion.div>

        <p className="mt-6 sm:mt-8 text-slate-500 text-sm sm:text-lg font-display text-center">
          {spinning
            ? dict.spin.spinning
            : kid.pendingSpins > 0
              ? dict.spin.tapToSpin
              : dict.spin.noSpinsLeft}
        </p>
      </div>
    </div>
  )
}
