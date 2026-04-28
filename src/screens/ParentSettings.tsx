import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'
import { Button } from '../components/Button'
import { EmojiPicker } from '../components/EmojiPicker'
import { AvatarPicker } from '../components/AvatarPicker'
import { KidAvatar } from '../components/KidAvatar'
import { SetPinModal } from '../components/PinPad'
import type { Deed, Kid, Reward } from '../types'
import { SUPPORTED_LOCALES, useLocaleStore, useT, type Locale } from '../i18n'

type Props = {
  onBack: () => void
}

type Tab = 'kids' | 'deeds' | 'rewards' | 'settings'

export function ParentSettings({ onBack }: Props) {
  const [tab, setTab] = useState<Tab>('kids')
  const { dict } = useT()

  return (
    <div className="min-h-full flex flex-col p-4 sm:p-8">
      <div className="flex justify-between items-center mb-4">
        <Button variant="gray" size="sm" onClick={onBack}>
          {dict.common.back}
        </Button>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold">
          {dict.parent.title}
        </h1>
        <div className="w-24" />
      </div>

      <div className="flex gap-2 sm:gap-3 mb-6 justify-center flex-wrap">
        {([
          ['kids', dict.parent.tabs.kids],
          ['deeds', dict.parent.tabs.deeds],
          ['rewards', dict.parent.tabs.rewards],
          ['settings', dict.parent.tabs.settings],
        ] as [Tab, string][]).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-4 py-2 sm:px-5 sm:py-3 rounded-2xl font-bold font-display transition-all ${
              tab === k
                ? 'bg-candy-pink text-white shadow-toy-sm'
                : 'bg-white text-slate-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full">
        {tab === 'kids' && <KidsTab />}
        {tab === 'deeds' && <DeedsTab />}
        {tab === 'rewards' && <RewardsTab />}
        {tab === 'settings' && <SettingsTab />}
      </div>
    </div>
  )
}

/* ---------------------------------- Kids ---------------------------------- */

function KidsTab() {
  const kids = useStore((s) => s.kids)
  const addKid = useStore((s) => s.addKid)
  const updateKid = useStore((s) => s.updateKid)
  const removeKid = useStore((s) => s.removeKid)
  const [editing, setEditing] = useState<Kid | null>(null)
  const [creating, setCreating] = useState(false)
  const { t, dict } = useT()

  return (
    <div>
      <div className="space-y-3">
        {kids.map((k) => (
          <div key={k.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-toy-sm">
            <KidAvatar value={k.avatar} className="text-5xl w-16 h-16" />
            <div className="flex-1">
              <div className="text-xl font-display font-bold">{k.name}</div>
              <div className="text-sm text-slate-500">
                {t(dict.parent.kids.perKidStats, { stars: k.totalStars, spins: k.pendingSpins })}
              </div>
            </div>
            <Button size="sm" variant="blue" onClick={() => setEditing(k)}>
              {dict.common.edit}
            </Button>
            <Button
              size="sm"
              variant="gray"
              onClick={() => {
                if (kids.length <= 1) {
                  alert(dict.parent.kids.atLeastOne)
                  return
                }
                if (confirm(t(dict.parent.kids.confirmDelete, { name: k.name }))) removeKid(k.id)
              }}
            >
              {dict.common.delete}
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Button variant="green" onClick={() => setCreating(true)}>
          {dict.parent.kids.addKid}
        </Button>
      </div>

      <KidEditModal
        open={creating}
        kid={null}
        onSave={(name, avatar) => {
          addKid({ name, avatar })
          setCreating(false)
        }}
        onClose={() => setCreating(false)}
      />
      <KidEditModal
        open={!!editing}
        kid={editing}
        onSave={(name, avatar, totalStars, pendingSpins) => {
          if (editing) {
            updateKid(editing.id, {
              name,
              avatar,
              ...(totalStars !== undefined ? { totalStars } : {}),
              ...(pendingSpins !== undefined ? { pendingSpins } : {}),
            })
          }
          setEditing(null)
        }}
        onClose={() => setEditing(null)}
      />
    </div>
  )
}

function KidEditModal({
  open,
  kid,
  onSave,
  onClose,
}: {
  open: boolean
  kid: Kid | null
  onSave: (name: string, avatar: string, totalStars?: number, pendingSpins?: number) => void
  onClose: () => void
}) {
  const { dict } = useT()
  return (
    <Modal open={open} onClose={onClose} title={kid ? dict.parent.kids.modalEdit : dict.parent.kids.modalAdd}>
      <ModalKidForm
        key={kid?.id ?? 'new'}
        initialName={kid?.name ?? ''}
        initialAvatar={kid?.avatar ?? '👶'}
        initialStars={kid?.totalStars ?? 0}
        initialSpins={kid?.pendingSpins ?? 0}
        showAdvanced={!!kid}
        onCancel={onClose}
        onSave={(n, a, s, sp) => onSave(n, a, s, sp)}
      />
    </Modal>
  )
}

function ModalKidForm({
  initialName,
  initialAvatar,
  initialStars,
  initialSpins,
  showAdvanced,
  onCancel,
  onSave,
}: {
  initialName: string
  initialAvatar: string
  initialStars: number
  initialSpins: number
  showAdvanced: boolean
  onCancel: () => void
  onSave: (name: string, avatar: string, stars?: number, spins?: number) => void
}) {
  const [name, setName] = useState(initialName)
  const [avatar, setAvatar] = useState(initialAvatar)
  const [stars, setStars] = useState(initialStars)
  const [spins, setSpins] = useState(initialSpins)
  const { dict } = useT()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <AvatarPicker value={avatar} onChange={setAvatar} />
        <input
          className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-candy-pink outline-none text-lg"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={dict.parent.kids.namePlaceholder}
        />
      </div>
      {showAdvanced && (
        <div className="grid grid-cols-2 gap-3">
          <NumberField label={dict.parent.kids.totalStars} value={stars} onChange={setStars} />
          <NumberField label={dict.parent.kids.pendingSpins} value={spins} onChange={setSpins} />
        </div>
      )}
      <div className="flex gap-3 justify-end pt-2">
        <Button variant="gray" onClick={onCancel}>
          {dict.common.cancel}
        </Button>
        <Button
          variant="green"
          onClick={() => {
            if (!name.trim()) return
            onSave(name.trim(), avatar, showAdvanced ? stars : undefined, showAdvanced ? spins : undefined)
          }}
        >
          {dict.common.save}
        </Button>
      </div>
    </div>
  )
}

/* ---------------------------------- Deeds --------------------------------- */

function DeedsTab() {
  const deeds = useStore((s) => s.deeds)
  const addDeed = useStore((s) => s.addDeed)
  const updateDeed = useStore((s) => s.updateDeed)
  const removeDeed = useStore((s) => s.removeDeed)
  const [editing, setEditing] = useState<Deed | null>(null)
  const [creating, setCreating] = useState(false)
  const { t, dict } = useT()

  return (
    <div>
      <div className="space-y-3">
        {deeds.map((d) => (
          <div key={d.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-toy-sm">
            <div className="text-4xl">{d.icon}</div>
            <div className="flex-1">
              <div className="text-xl font-display font-bold">{d.name}</div>
              <div className="text-sm text-slate-500">{t(dict.parent.deeds.spinUnit, { count: d.spinCount })}</div>
            </div>
            <Button size="sm" variant="blue" onClick={() => setEditing(d)}>
              {dict.common.edit}
            </Button>
            <Button
              size="sm"
              variant="gray"
              onClick={() => {
                if (confirm(t(dict.parent.deeds.confirmDelete, { name: d.name }))) removeDeed(d.id)
              }}
            >
              {dict.common.delete}
            </Button>
          </div>
        ))}
        {deeds.length === 0 && (
          <div className="text-center text-slate-500 py-10">{dict.parent.deeds.empty}</div>
        )}
      </div>
      <div className="mt-6 text-center">
        <Button variant="green" onClick={() => setCreating(true)}>
          {dict.parent.deeds.addDeed}
        </Button>
      </div>

      <Modal open={creating} onClose={() => setCreating(false)} title={dict.parent.deeds.modalAdd}>
        <DeedForm
          key="new"
          initial={{ name: '', icon: '⭐', spinCount: 1 }}
          onCancel={() => setCreating(false)}
          onSave={(d) => {
            addDeed(d)
            setCreating(false)
          }}
        />
      </Modal>
      <Modal open={!!editing} onClose={() => setEditing(null)} title={dict.parent.deeds.modalEdit}>
        {editing && (
          <DeedForm
            key={editing.id}
            initial={editing}
            onCancel={() => setEditing(null)}
            onSave={(d) => {
              updateDeed(editing.id, d)
              setEditing(null)
            }}
          />
        )}
      </Modal>
    </div>
  )
}

function DeedForm({
  initial,
  onCancel,
  onSave,
}: {
  initial: Pick<Deed, 'name' | 'icon' | 'spinCount'>
  onCancel: () => void
  onSave: (d: Pick<Deed, 'name' | 'icon' | 'spinCount'>) => void
}) {
  const [name, setName] = useState(initial.name)
  const [icon, setIcon] = useState(initial.icon)
  const [spinCount, setSpinCount] = useState(initial.spinCount)
  const { dict } = useT()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <EmojiPicker value={icon} onChange={setIcon} />
        <input
          className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-candy-pink outline-none text-lg"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={dict.parent.deeds.namePlaceholder}
        />
      </div>
      <NumberField label={dict.parent.deeds.spinCountLabel} value={spinCount} min={0} onChange={setSpinCount} />
      <div className="flex gap-3 justify-end pt-2">
        <Button variant="gray" onClick={onCancel}>
          {dict.common.cancel}
        </Button>
        <Button
          variant="green"
          onClick={() => {
            if (!name.trim()) return
            onSave({ name: name.trim(), icon, spinCount: Math.max(0, spinCount) })
          }}
        >
          {dict.common.save}
        </Button>
      </div>
    </div>
  )
}

/* --------------------------------- Rewards -------------------------------- */

function RewardsTab() {
  const rewards = useStore((s) => s.rewards)
  const addReward = useStore((s) => s.addReward)
  const updateReward = useStore((s) => s.updateReward)
  const removeReward = useStore((s) => s.removeReward)
  const [editing, setEditing] = useState<Reward | null>(null)
  const [creating, setCreating] = useState(false)
  const { t, dict } = useT()

  const sorted = [...rewards].sort((a, b) => a.starCost - b.starCost)

  return (
    <div>
      <div className="space-y-3">
        {sorted.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-toy-sm">
            <div className="text-4xl">{r.icon}</div>
            <div className="flex-1">
              <div className="text-xl font-display font-bold">{r.name}</div>
              <div className="text-sm text-slate-500">{t(dict.parent.rewards.starsCost, { count: r.starCost })}</div>
            </div>
            <Button size="sm" variant="blue" onClick={() => setEditing(r)}>
              {dict.common.edit}
            </Button>
            <Button
              size="sm"
              variant="gray"
              onClick={() => {
                if (confirm(t(dict.parent.rewards.confirmDelete, { name: r.name }))) removeReward(r.id)
              }}
            >
              {dict.common.delete}
            </Button>
          </div>
        ))}
        {sorted.length === 0 && (
          <div className="text-center text-slate-500 py-10">{dict.parent.rewards.empty}</div>
        )}
      </div>
      <div className="mt-6 text-center">
        <Button variant="green" onClick={() => setCreating(true)}>
          {dict.parent.rewards.addReward}
        </Button>
      </div>

      <Modal open={creating} onClose={() => setCreating(false)} title={dict.parent.rewards.modalAdd}>
        <RewardForm
          key="new"
          initial={{ name: '', icon: '🎁', starCost: 50 }}
          onCancel={() => setCreating(false)}
          onSave={(r) => {
            addReward(r)
            setCreating(false)
          }}
        />
      </Modal>
      <Modal open={!!editing} onClose={() => setEditing(null)} title={dict.parent.rewards.modalEdit}>
        {editing && (
          <RewardForm
            key={editing.id}
            initial={editing}
            onCancel={() => setEditing(null)}
            onSave={(r) => {
              updateReward(editing.id, r)
              setEditing(null)
            }}
          />
        )}
      </Modal>
    </div>
  )
}

function RewardForm({
  initial,
  onCancel,
  onSave,
}: {
  initial: Pick<Reward, 'name' | 'icon' | 'starCost'>
  onCancel: () => void
  onSave: (r: Pick<Reward, 'name' | 'icon' | 'starCost'>) => void
}) {
  const [name, setName] = useState(initial.name)
  const [icon, setIcon] = useState(initial.icon)
  const [starCost, setStarCost] = useState(initial.starCost)
  const { dict } = useT()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <EmojiPicker value={icon} onChange={setIcon} />
        <input
          className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-candy-pink outline-none text-lg"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={dict.parent.rewards.namePlaceholder}
        />
      </div>
      <NumberField label={dict.parent.rewards.starCostLabel} value={starCost} min={1} onChange={setStarCost} />
      <div className="flex gap-3 justify-end pt-2">
        <Button variant="gray" onClick={onCancel}>
          {dict.common.cancel}
        </Button>
        <Button
          variant="green"
          onClick={() => {
            if (!name.trim()) return
            onSave({ name: name.trim(), icon, starCost: Math.max(1, starCost) })
          }}
        >
          {dict.common.save}
        </Button>
      </div>
    </div>
  )
}

/* --------------------------------- Settings ------------------------------- */

function SettingsTab() {
  const settings = useStore((s) => s.settings)
  const updateSettings = useStore((s) => s.updateSettings)
  const clearAllData = useStore((s) => s.clearAllData)
  const [minStars, setMinStars] = useState(settings.minStars)
  const [maxStars, setMaxStars] = useState(settings.maxStars)
  const [pinOpen, setPinOpen] = useState(false)
  const { dict } = useT()
  const locale = useLocaleStore((s) => s.locale)
  const setLocale = useLocaleStore((s) => s.setLocale)

  const saveStars = () => {
    const lo = Math.max(1, Math.min(minStars, maxStars))
    const hi = Math.max(lo, maxStars)
    updateSettings({ minStars: lo, maxStars: hi })
    alert(dict.common.saved)
  }

  return (
    <div className="space-y-5 bg-white rounded-3xl p-6 shadow-toy-sm">
      <div>
        <div className="font-display font-bold text-lg mb-2">{dict.parent.settings.starsPerSpinTitle}</div>
        <div className="grid grid-cols-2 gap-3">
          <NumberField label={dict.parent.settings.starsMin} value={minStars} min={1} onChange={setMinStars} />
          <NumberField label={dict.parent.settings.starsMax} value={maxStars} min={1} onChange={setMaxStars} />
        </div>
        <div className="mt-3">
          <Button size="sm" variant="green" onClick={saveStars}>
            {dict.common.save}
          </Button>
        </div>
      </div>

      <hr />

      <div>
        <div className="font-display font-bold text-lg mb-2">{dict.parent.settings.languageTitle}</div>
        <div className="text-sm text-slate-500 mb-3">{dict.parent.settings.languageHint}</div>
        <div className="flex flex-wrap gap-2">
          {SUPPORTED_LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLocale(l)}
              className={`px-4 py-2 rounded-2xl font-bold font-display text-sm transition-all ${
                locale === l
                  ? 'bg-candy-pink text-white shadow-toy-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dict.languages[l as Locale]}
            </button>
          ))}
        </div>
      </div>

      <hr />

      <div>
        <div className="font-display font-bold text-lg mb-2">{dict.parent.settings.pinTitle}</div>
        <div className="text-sm text-slate-500 mb-3">
          {dict.parent.settings.pinCurrent} <span className="font-mono">{'•'.repeat(settings.parentPin.length)}</span>
        </div>
        <Button size="sm" variant="blue" onClick={() => setPinOpen(true)}>
          {dict.parent.settings.changePin}
        </Button>
      </div>

      <hr />

      <div>
        <div className="font-display font-bold text-lg mb-2 text-red-500">{dict.parent.settings.resetTitle}</div>
        <div className="text-sm text-slate-500 mb-3">
          {dict.parent.settings.resetHint}
        </div>
        <Button
          size="sm"
          variant="orange"
          onClick={() => {
            if (confirm(dict.parent.settings.resetConfirm)) clearAllData()
          }}
        >
          {dict.parent.settings.resetButton}
        </Button>
      </div>

      <SetPinModal
        open={pinOpen}
        onSave={(pin) => {
          updateSettings({ parentPin: pin })
          setPinOpen(false)
        }}
        onCancel={() => setPinOpen(false)}
      />
    </div>
  )
}

/* --------------------------- Generic Sub-Components --------------------------- */

function NumberField({
  label,
  value,
  onChange,
  min,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
}) {
  const dec = () => onChange(Math.max(min ?? 0, value - 1))
  const inc = () => onChange(value + 1)
  return (
    <div className="min-w-0">
      <div className="text-sm text-slate-500 mb-1">{label}</div>
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
        <button
          onClick={dec}
          className="bg-slate-100 hover:bg-slate-200 rounded-xl w-10 h-10 sm:w-12 sm:h-12 text-2xl font-bold shrink-0"
        >
          −
        </button>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value.replace(/[^0-9]/g, '') || '0', 10) || 0)}
          className="w-0 flex-1 min-w-0 text-center px-2 py-2 sm:px-3 sm:py-3 rounded-xl border-2 border-slate-200 focus:border-candy-pink outline-none text-lg sm:text-xl font-bold"
        />
        <button
          onClick={inc}
          className="bg-slate-100 hover:bg-slate-200 rounded-xl w-10 h-10 sm:w-12 sm:h-12 text-2xl font-bold shrink-0"
        >
          +
        </button>
      </div>
    </div>
  )
}

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur p-3 sm:p-6"
        >
          <motion.div
            initial={{ scale: 0.7, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.7, y: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-4 sm:p-6 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-xl font-display font-extrabold mb-4">{title}</h3>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
