import { motion } from 'framer-motion'
import { useStore } from '../store'
import { Button } from '../components/Button'
import { KidAvatar } from '../components/KidAvatar'
import { useT } from '../i18n'

type Props = {
  kidId: string
  onBack: () => void
  onCheckin: () => void
  onSpin: () => void
  onRewards: () => void
  onHistory: () => void
}

export function KidHome({ kidId, onBack, onCheckin, onSpin, onRewards, onHistory }: Props) {
  const kid = useStore((s) => s.kids.find((k) => k.id === kidId))
  const { dict } = useT()
  if (!kid) return null

  return (
    <div className="min-h-full flex flex-col p-6 sm:p-10">
      <div className="flex justify-between items-start mb-6">
        <Button variant="gray" size="sm" onClick={onBack}>
          {dict.kidHome.changeKid}
        </Button>
      </div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <div className="mb-2">
          <KidAvatar value={kid.avatar} className="text-9xl w-36 h-36" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold mb-2">{kid.name}</h1>
        <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-toy">
          <span className="text-3xl">⭐</span>
          <span className="text-3xl font-display font-extrabold text-candy-yellow">
            {kid.totalStars}
          </span>
          <span className="text-xl text-slate-500 font-bold">{dict.kidHome.starsLabel}</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
        >
          <Button variant="green" size="xl" className="w-full" onClick={onCheckin}>
            {dict.kidHome.checkin}
          </Button>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <Button
            variant={kid.pendingSpins > 0 ? 'pink' : 'gray'}
            size="xl"
            className="w-full"
            onClick={onSpin}
            disabled={kid.pendingSpins === 0}
          >
            {dict.kidHome.spin}
          </Button>
          {kid.pendingSpins > 0 && (
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="absolute -top-3 -right-3 bg-candy-yellow text-amber-900 rounded-full w-12 h-12 flex items-center justify-center text-2xl font-extrabold shadow-toy-sm"
            >
              {kid.pendingSpins}
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <Button variant="purple" size="xl" className="w-full" onClick={onRewards}>
            {dict.kidHome.rewards}
          </Button>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button variant="blue" size="xl" className="w-full" onClick={onHistory}>
            {dict.kidHome.history}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
