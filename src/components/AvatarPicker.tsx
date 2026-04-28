import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { isImageAvatar } from './KidAvatar'
import { EmojiPanel } from './EmojiPanel'
import { getDict, useLocaleStore, useT } from '../i18n'

const MAX_SIZE = 256
const JPEG_QUALITY = 0.82

async function fileToSquareDataUrl(file: File): Promise<string> {
  const av = getDict(useLocaleStore.getState().locale).avatar
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image()
      i.onload = () => resolve(i)
      i.onerror = () => reject(new Error(av.cannotReadImage))
      i.src = url
    })
    const side = Math.min(img.naturalWidth, img.naturalHeight)
    const sx = (img.naturalWidth - side) / 2
    const sy = (img.naturalHeight - side) / 2
    const out = Math.min(MAX_SIZE, side)
    const canvas = document.createElement('canvas')
    canvas.width = out
    canvas.height = out
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error(av.canvasNotSupported)
    ctx.drawImage(img, sx, sy, side, side, 0, 0, out, out)
    return canvas.toDataURL('image/jpeg', JPEG_QUALITY)
  } finally {
    URL.revokeObjectURL(url)
  }
}

type Props = {
  value: string
  onChange: (v: string) => void
}

export function AvatarPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const { dict } = useT()

  const isImage = isImageAvatar(value)

  const handleFile = async (file: File) => {
    setBusy(true)
    try {
      const dataUrl = await fileToSquareDataUrl(file)
      onChange(dataUrl)
      setOpen(false)
    } catch (e) {
      alert((e as Error).message || dict.avatar.cannotProcessImage)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-4xl bg-slate-100 hover:bg-slate-200 rounded-2xl w-16 h-16 flex items-center justify-center overflow-hidden shrink-0"
      >
        {isImage ? (
          <img src={value} alt="" className="w-full h-full object-cover" />
        ) : (
          value || '❓'
        )}
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          e.target.value = ''
          if (f) handleFile(f)
        }}
      />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute z-30 mt-2 bg-white rounded-2xl shadow-2xl p-3 w-72 sm:w-80"
          >
            <EmojiPanel
              header={
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => fileRef.current?.click()}
                    className="flex-1 bg-candy-blue text-white rounded-xl px-3 py-2 text-sm font-bold disabled:opacity-60"
                  >
                    {busy ? dict.avatar.processing : dict.avatar.upload}
                  </button>
                  {isImage && (
                    <button
                      type="button"
                      onClick={() => {
                        onChange('👶')
                        setOpen(false)
                      }}
                      className="bg-slate-100 hover:bg-slate-200 rounded-xl px-3 py-2 text-sm font-bold"
                    >
                      {dict.avatar.remove}
                    </button>
                  )}
                </div>
              }
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
