import { motion } from 'framer-motion'
import { useStore } from '../store'
import { Button } from '../components/Button'
import { useState } from 'react'
import { PinPad } from '../components/PinPad'
import { KidAvatar } from '../components/KidAvatar'
import { useT } from '../i18n'

type Props = {
  onPickKid: (id: string) => void
  onOpenParent: () => void
}

export function ProfileSelect({ onPickKid, onOpenParent }: Props) {
  const kids = useStore((s) => s.kids)
  const settings = useStore((s) => s.settings)
  const [pinOpen, setPinOpen] = useState(false)
  const { t, dict } = useT()

  return (
    <div className="min-h-full h-full w-full flex flex-col items-center justify-center p-8">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-5xl sm:text-6xl font-display font-extrabold text-center mb-2"
      >
        <span className="text-candy-pink">{dict.profileSelect.titlePart1}</span>{' '}
        <span className="text-candy-purple">{dict.profileSelect.titlePart2}</span>{' '}
        <span className="text-candy-yellow">⭐</span>
      </motion.h1>
      <p className="text-lg text-slate-500 mb-12">{dict.profileSelect.subtitle}</p>

      <div className="flex gap-6 sm:gap-10 flex-wrap justify-center">
        {kids.map((k, i) => (
          <motion.button
            key={k.id}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 * i }}
            whileTap={{ scale: 0.94 }}
            whileHover={{ scale: 1.04 }}
            onClick={() => onPickKid(k.id)}
            className="bg-white rounded-3xl p-8 shadow-toy w-56 hover:shadow-2xl transition-shadow"
          >
            <div className="mb-3">
              <KidAvatar value={k.avatar} className="text-8xl w-28 h-28" />
            </div>
            <div className="text-2xl font-display font-bold mb-1">{k.name}</div>
            <div className="text-candy-yellow font-bold text-lg">{k.totalStars} ⭐</div>
            {k.pendingSpins > 0 && (
              <div className="mt-2 inline-block bg-candy-pink text-white rounded-full px-3 py-1 text-sm font-bold animate-wiggle">
                {t(dict.profileSelect.spinsBadge, { count: k.pendingSpins })}
              </div>
            )}
          </motion.button>
        ))}
      </div>

      <div className="mt-16">
        <Button variant="gray" size="md" onClick={() => setPinOpen(true)}>
          {dict.profileSelect.parentSettings}
        </Button>
      </div>

      <PinPad
        open={pinOpen}
        expectedPin={settings.parentPin}
        onSuccess={() => {
          setPinOpen(false)
          onOpenParent()
        }}
        onCancel={() => setPinOpen(false)}
      />
    </div>
  )
}
