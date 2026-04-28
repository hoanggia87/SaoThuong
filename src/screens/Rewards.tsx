import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import confetti from 'canvas-confetti'
import { useStore } from '../store'
import { Button } from '../components/Button'
import type { Reward } from '../types'
import { useT } from '../i18n'

type Props = {
  kidId: string
  onBack: () => void
}

export function Rewards({ kidId, onBack }: Props) {
  const kid = useStore((s) => s.kids.find((k) => k.id === kidId))
  const rewards = useStore((s) => s.rewards)
  const redeem = useStore((s) => s.redeemReward)
  const [confirming, setConfirming] = useState<Reward | null>(null)
  const [success, setSuccess] = useState<Reward | null>(null)
  const { t, dict } = useT()

  if (!kid) return null

  const sorted = [...rewards].sort((a, b) => a.starCost - b.starCost)

  const doRedeem = () => {
    if (!confirming) return
    if (redeem(kidId, confirming.id)) {
      setSuccess(confirming)
      confetti({
        particleCount: 200,
        spread: 110,
        origin: { y: 0.5 },
        colors: ['#ff6fa3', '#b760ff', '#5ec8ff', '#ffd64a', '#5fe0a8'],
      })
    }
    setConfirming(null)
  }

  return (
    <div className="min-h-full flex flex-col p-6 sm:p-10">
      <div className="flex justify-between items-center mb-6">
        <Button variant="gray" size="sm" onClick={onBack}>
          {dict.common.back}
        </Button>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold">{dict.rewards.title}</h1>
        <div className="bg-white rounded-full px-5 py-2 shadow-toy-sm">
          <span className="text-2xl font-display font-extrabold text-candy-yellow">
            {kid.totalStars} ⭐
          </span>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center text-slate-500 mt-20 text-xl">
          {dict.rewards.empty}
          <br />
          {dict.rewards.addInSettings}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto w-full">
          {sorted.map((r, i) => {
            const can = kid.totalStars >= r.starCost
            return (
              <motion.button
                key={r.id}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05 * i }}
                whileTap={can ? { scale: 0.96 } : {}}
                onClick={() => can && setConfirming(r)}
                disabled={!can}
                className={`p-6 rounded-3xl shadow-toy text-left transition-all ${
                  can
                    ? 'bg-gradient-to-br from-white to-pink-50 hover:shadow-2xl'
                    : 'bg-slate-100 opacity-70'
                }`}
              >
                <div className="text-7xl mb-3">{r.icon}</div>
                <div className="text-2xl font-display font-bold mb-2">{r.name}</div>
                <div
                  className={`inline-flex items-center gap-1 rounded-full px-4 py-2 font-bold ${
                    can ? 'bg-candy-yellow text-amber-900' : 'bg-slate-300 text-slate-500'
                  }`}
                >
                  ⭐ {r.starCost}
                </div>
                {!can && (
                  <div className="mt-3 text-sm text-slate-500">
                    {t(dict.rewards.needMoreStars, { count: r.starCost - kid.totalStars })}
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>
      )}

      <AnimatePresence>
        {confirming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirming(null)}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur p-6"
          >
            <motion.div
              initial={{ scale: 0.7, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.7, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
            >
              <div className="text-7xl mb-3">{confirming.icon}</div>
              <div className="text-2xl font-display font-bold mb-2">
                {t(dict.rewards.redeemQuestion, { name: confirming.name })}
              </div>
              <div className="text-slate-500 mb-6">
                {dict.rewards.willDeductPrefix}{' '}
                <span className="text-candy-pink font-bold">{confirming.starCost} ⭐</span>{' '}
                {dict.rewards.willDeductSuffix}
              </div>
              <div className="flex gap-3 justify-center">
                <Button variant="gray" onClick={() => setConfirming(null)}>
                  {dict.common.cancel}
                </Button>
                <Button variant="purple" onClick={doRedeem}>
                  {dict.rewards.redeemNow}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSuccess(null)}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur p-6"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 14 }}
              className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl"
            >
              <div className="text-8xl mb-4 animate-pop">{success.icon}</div>
              <div className="text-3xl font-display font-extrabold mb-2 text-candy-purple">
                {dict.rewards.congrats}
              </div>
              <div className="text-xl mb-6">
                {dict.rewards.youRedeemedPrefix} <b>{success.name}</b>
              </div>
              <Button variant="purple" size="lg" onClick={() => setSuccess(null)}>
                {dict.common.awesome}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
