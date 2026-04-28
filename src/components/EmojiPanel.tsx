import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EMOJI_CATEGORIES } from '../lib/emojiCatalog'
import { useT } from '../i18n'

type Props = {
  onPick: (emoji: string) => void
  header?: ReactNode
}

export function EmojiPanel({ onPick, header }: Props) {
  const [pageIdx, setPageIdx] = useState(0)
  const [direction, setDirection] = useState(0)
  const cat = EMOJI_CATEGORIES[pageIdx]
  const { dict } = useT()
  const labelOf = (id: keyof typeof dict.emoji) => dict.emoji[id] ?? id

  const goTo = (i: number) => {
    if (i === pageIdx || i < 0 || i >= EMOJI_CATEGORIES.length) return
    setDirection(i > pageIdx ? 1 : -1)
    setPageIdx(i)
  }

  return (
    <div>
      {header && <div className="mb-3">{header}</div>}

      <div className="flex gap-1 mb-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
        {EMOJI_CATEGORIES.map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => goTo(i)}
            title={labelOf(c.id)}
            className={`shrink-0 text-xl w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              i === pageIdx
                ? 'bg-candy-pink/15 ring-2 ring-candy-pink'
                : 'hover:bg-slate-100'
            }`}
          >
            {c.icon}
          </button>
        ))}
      </div>

      <div className="text-xs text-slate-500 mb-1.5 px-0.5">{labelOf(cat.id)}</div>

      <div className="relative overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={cat.id}
            initial={{ x: direction * 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -direction * 60, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              const threshold = 60
              if (info.offset.x < -threshold) goTo(pageIdx + 1)
              else if (info.offset.x > threshold) goTo(pageIdx - 1)
            }}
            className="grid grid-cols-7 gap-1 max-h-56 overflow-y-auto touch-pan-y"
          >
            {cat.emojis.map((e, i) => (
              <button
                key={`${cat.id}-${i}`}
                type="button"
                onClick={() => onPick(e)}
                className="text-2xl hover:bg-slate-100 rounded-lg p-1 active:scale-95 transition-transform"
              >
                {e}
              </button>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-1.5 mt-2">
        {EMOJI_CATEGORIES.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === pageIdx ? 'w-4 bg-candy-pink' : 'w-1.5 bg-slate-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
