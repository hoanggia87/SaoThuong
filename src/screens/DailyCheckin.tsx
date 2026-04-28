import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import confetti from 'canvas-confetti'
import { useStore } from '../store'
import { Button } from '../components/Button'
import { useT } from '../i18n'

type Props = {
  kidId: string
  onBack: () => void
  onGoSpin: () => void
}

export function DailyCheckin({ kidId, onBack, onGoSpin }: Props) {
  const deeds = useStore((s) => s.deeds)
  const checkin = useStore((s) => s.checkinDeeds)
  const kid = useStore((s) => s.kids.find((k) => k.id === kidId))
  const [picked, setPicked] = useState<Set<string>>(new Set())
  const [showResult, setShowResult] = useState<number | null>(null)
  const { t, dict } = useT()

  const toggle = (id: string) => {
    setPicked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const totalSpinsPreview = Array.from(picked).reduce((sum, id) => {
    const d = deeds.find((x) => x.id === id)
    return sum + (d?.spinCount ?? 0)
  }, 0)

  const confirm = () => {
    if (picked.size === 0) return
    const { totalSpins } = checkin(kidId, Array.from(picked))
    setShowResult(totalSpins)
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#ff6fa3', '#b760ff', '#5ec8ff', '#ffd64a', '#5fe0a8'],
    })
  }

  if (!kid) return null

  return (
    <div className="min-h-full flex flex-col p-6 sm:p-10">
      <div className="flex justify-between items-center mb-6">
        <Button variant="gray" size="sm" onClick={onBack}>
          {dict.common.back}
        </Button>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-center">
          {t(dict.checkin.titleFor, { name: kid.name })}
        </h1>
        <div className="w-24" />
      </div>

      {deeds.length === 0 ? (
        <div className="text-center text-slate-500 mt-20 text-xl">
          {dict.checkin.empty}
          <br />
          {dict.checkin.addInSettings}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-3xl mx-auto w-full">
          {deeds.map((d) => {
            const on = picked.has(d.id)
            return (
              <motion.button
                key={d.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggle(d.id)}
                className={`flex items-center gap-4 p-5 rounded-2xl shadow-toy-sm transition-all text-left ${
                  on
                    ? 'bg-gradient-to-r from-candy-green to-candy-blue text-white'
                    : 'bg-white'
                }`}
              >
                <div className="text-5xl">{d.icon}</div>
                <div className="flex-1">
                  <div className="text-2xl font-display font-bold">{d.name}</div>
                  <div className={`text-sm ${on ? 'text-white/90' : 'text-slate-500'}`}>
                    {t(dict.checkin.spinUnit, { count: d.spinCount })}
                  </div>
                </div>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold ${
                    on ? 'bg-white text-candy-green' : 'bg-slate-100 text-slate-300'
                  }`}
                >
                  {on ? '✓' : ''}
                </div>
              </motion.button>
            )
          })}
        </div>
      )}

      {picked.size > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed left-0 right-0 bottom-0 p-4 bg-white/90 backdrop-blur border-t-2 border-slate-100"
        >
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-slate-500">{t(dict.checkin.selected, { count: picked.size })}</div>
              <div className="text-2xl font-display font-extrabold text-candy-pink">
                {t(dict.checkin.totalSpins, { count: totalSpinsPreview })}
              </div>
            </div>
            <Button variant="green" size="lg" onClick={confirm}>
              {dict.checkin.confirm}
            </Button>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {showResult !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur p-6"
          >
            <motion.div
              initial={{ scale: 0.5, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 16 }}
              className="bg-white rounded-3xl p-10 text-center shadow-2xl max-w-md"
            >
              <div className="text-7xl mb-3 animate-pop">🎉</div>
              <div className="text-3xl font-display font-extrabold mb-2">
                {t(dict.checkin.great, { name: kid.name })}
              </div>
              <div className="text-xl text-slate-500 mb-6">{dict.checkin.youGet}</div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
                className="text-7xl font-display font-extrabold text-candy-pink mb-2"
              >
                🎰 {showResult}
              </motion.div>
              <div className="text-2xl font-bold text-slate-600 mb-8">{dict.checkin.spinUnit2}</div>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="gray"
                  onClick={() => {
                    setShowResult(null)
                    setPicked(new Set())
                    onBack()
                  }}
                >
                  {dict.common.later}
                </Button>
                <Button
                  variant="pink"
                  size="lg"
                  onClick={() => {
                    setShowResult(null)
                    onGoSpin()
                  }}
                >
                  {dict.checkin.spinNow}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
