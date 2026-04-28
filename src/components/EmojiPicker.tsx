import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EmojiPanel } from './EmojiPanel'

type Props = {
  value: string
  onChange: (e: string) => void
}

export function EmojiPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-4xl bg-slate-100 hover:bg-slate-200 rounded-2xl w-16 h-16 flex items-center justify-center"
      >
        {value || '❓'}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute z-30 mt-2 bg-white rounded-2xl shadow-2xl p-3 w-72 sm:w-80"
          >
            <EmojiPanel
              onPick={(e) => {
                onChange(e)
                setOpen(false)
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
