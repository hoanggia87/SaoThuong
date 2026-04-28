import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Button } from './Button'
import { useT } from '../i18n'

type Props = {
  open: boolean
  expectedPin: string
  title?: string
  onSuccess: () => void
  onCancel: () => void
}

export function PinPad({ open, expectedPin, title, onSuccess, onCancel }: Props) {
  const { dict } = useT()
  const resolvedTitle = title ?? dict.pin.enterPin
  const [pin, setPin] = useState('')
  const [shake, setShake] = useState(false)

  useEffect(() => {
    if (open) setPin('')
  }, [open])

  const press = (digit: string) => {
    if (pin.length >= 6) return
    const next = pin + digit
    setPin(next)
    if (next.length === expectedPin.length) {
      if (next === expectedPin) {
        setTimeout(onSuccess, 120)
      } else {
        setShake(true)
        setTimeout(() => {
          setShake(false)
          setPin('')
        }, 500)
      }
    }
  }

  const back = () => setPin((p) => p.slice(0, -1))

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className="bg-white rounded-3xl p-5 sm:p-8 w-full max-w-md shadow-2xl"
            initial={{ scale: 0.7, y: 30 }}
            animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : { scale: 1, y: 0 }}
            exit={{ scale: 0.7, y: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-center mb-2 font-display">{resolvedTitle}</h2>
            <div className="flex justify-center gap-3 my-6">
              {Array.from({ length: expectedPin.length }).map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-5 rounded-full transition-all ${
                    i < pin.length ? 'bg-candy-pink scale-110' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
                <motion.button
                  key={d}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => press(d)}
                  className="bg-slate-100 hover:bg-slate-200 rounded-2xl py-3.5 sm:py-5 text-2xl sm:text-3xl font-bold font-display"
                >
                  {d}
                </motion.button>
              ))}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onCancel}
                className="bg-slate-50 hover:bg-slate-100 rounded-2xl py-5 text-base font-bold text-slate-500"
              >
                {dict.common.cancel}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => press('0')}
                className="bg-slate-100 hover:bg-slate-200 rounded-2xl py-3.5 sm:py-5 text-2xl sm:text-3xl font-bold font-display"
              >
                0
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={back}
                className="bg-slate-50 hover:bg-slate-100 rounded-2xl py-5 text-2xl"
              >
                ⌫
              </motion.button>
            </div>
            <div className="mt-4 text-center text-xs text-slate-400">{dict.pin.defaultPin}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

type SetPinProps = {
  open: boolean
  onSave: (pin: string) => void
  onCancel: () => void
}

export function SetPinModal({ open, onSave, onCancel }: SetPinProps) {
  const [pin, setPin] = useState('')
  const [confirm, setConfirm] = useState('')
  const [stage, setStage] = useState<'new' | 'confirm'>('new')
  const [error, setError] = useState('')
  const { dict } = useT()

  useEffect(() => {
    if (open) {
      setPin('')
      setConfirm('')
      setStage('new')
      setError('')
    }
  }, [open])

  const handle = (val: string) => {
    if (stage === 'new') {
      setPin(val)
      if (val.length === 4) {
        setStage('confirm')
      }
    } else {
      setConfirm(val)
      if (val.length === 4) {
        if (val === pin) {
          setTimeout(() => onSave(val), 100)
        } else {
          setError(dict.pin.pinMismatch)
          setTimeout(() => {
            setConfirm('')
            setError('')
          }, 800)
        }
      }
    }
  }

  const current = stage === 'new' ? pin : confirm
  const press = (d: string) => {
    if (current.length >= 4) return
    handle(current + d)
  }
  const back = () => {
    if (stage === 'new') setPin((p) => p.slice(0, -1))
    else setConfirm((p) => p.slice(0, -1))
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-3xl p-5 sm:p-8 w-full max-w-md shadow-2xl"
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-center font-display">
              {stage === 'new' ? dict.pin.setNewPin : dict.pin.confirmPin}
            </h2>
            {error && <div className="text-center text-red-500 mt-2 font-bold">{error}</div>}
            <div className="flex justify-center gap-3 my-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-5 rounded-full ${
                    i < current.length ? 'bg-candy-pink' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
                <motion.button
                  key={d}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => press(d)}
                  className="bg-slate-100 rounded-2xl py-3.5 sm:py-5 text-2xl sm:text-3xl font-bold font-display"
                >
                  {d}
                </motion.button>
              ))}
              <Button size="sm" variant="gray" onClick={onCancel} className="text-base">
                {dict.common.cancel}
              </Button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => press('0')}
                className="bg-slate-100 rounded-2xl py-3.5 sm:py-5 text-2xl sm:text-3xl font-bold font-display"
              >
                0
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={back}
                className="bg-slate-50 rounded-2xl py-5 text-2xl"
              >
                ⌫
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
