import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Deed, Kid, LogEntry, Reward, Settings } from './types'
import { uid } from './lib/random'
import { getDict, useLocaleStore } from './i18n'

type State = {
  kids: Kid[]
  deeds: Deed[]
  rewards: Reward[]
  log: LogEntry[]
  settings: Settings

  // Kids
  addKid: (k: Omit<Kid, 'id' | 'totalStars' | 'pendingSpins'>) => void
  updateKid: (id: string, patch: Partial<Kid>) => void
  removeKid: (id: string) => void

  // Deeds
  addDeed: (d: Omit<Deed, 'id'>) => void
  updateDeed: (id: string, patch: Partial<Deed>) => void
  removeDeed: (id: string) => void

  // Rewards
  addReward: (r: Omit<Reward, 'id'>) => void
  updateReward: (id: string, patch: Partial<Reward>) => void
  removeReward: (id: string) => void

  // Settings
  updateSettings: (patch: Partial<Settings>) => void

  // Actions
  checkinDeeds: (kidId: string, deedIds: string[]) => { totalSpins: number }
  consumeSpin: (kidId: string, stars: number) => void
  redeemReward: (kidId: string, rewardId: string) => boolean

  // Utilities
  clearAllData: () => void
}

const seedKids = (): Kid[] => {
  const s = getDict(useLocaleStore.getState().locale).seed
  return [
    { id: uid(), name: s.kid1, avatar: '👦', totalStars: 0, pendingSpins: 0 },
    { id: uid(), name: s.kid2, avatar: '👧', totalStars: 0, pendingSpins: 0 },
  ]
}

const seedDeeds = (): Deed[] => {
  const s = getDict(useLocaleStore.getState().locale).seed
  return [
    { id: uid(), name: s.deed1, icon: '🪥', spinCount: 1 },
    { id: uid(), name: s.deed2, icon: '📚', spinCount: 2 },
    { id: uid(), name: s.deed3, icon: '🧸', spinCount: 1 },
    { id: uid(), name: s.deed4, icon: '🧹', spinCount: 2 },
    { id: uid(), name: s.deed5, icon: '🍚', spinCount: 1 },
  ]
}

const seedRewards = (): Reward[] => {
  const s = getDict(useLocaleStore.getState().locale).seed
  return [
    { id: uid(), name: s.reward1, icon: '📺', starCost: 50 },
    { id: uid(), name: s.reward2, icon: '🎮', starCost: 100 },
    { id: uid(), name: s.reward3, icon: '🐷', starCost: 200 },
  ]
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      kids: seedKids(),
      deeds: seedDeeds(),
      rewards: seedRewards(),
      log: [],
      settings: { parentPin: '1234', minStars: 5, maxStars: 10 },

      addKid: (k) =>
        set((s) => ({
          kids: [...s.kids, { ...k, id: uid(), totalStars: 0, pendingSpins: 0 }],
        })),
      updateKid: (id, patch) =>
        set((s) => ({ kids: s.kids.map((k) => (k.id === id ? { ...k, ...patch } : k)) })),
      removeKid: (id) =>
        set((s) => ({
          kids: s.kids.filter((k) => k.id !== id),
          log: s.log.filter((e) => e.kidId !== id),
        })),

      addDeed: (d) => set((s) => ({ deeds: [...s.deeds, { ...d, id: uid() }] })),
      updateDeed: (id, patch) =>
        set((s) => ({ deeds: s.deeds.map((d) => (d.id === id ? { ...d, ...patch } : d)) })),
      removeDeed: (id) => set((s) => ({ deeds: s.deeds.filter((d) => d.id !== id) })),

      addReward: (r) => set((s) => ({ rewards: [...s.rewards, { ...r, id: uid() }] })),
      updateReward: (id, patch) =>
        set((s) => ({ rewards: s.rewards.map((r) => (r.id === id ? { ...r, ...patch } : r)) })),
      removeReward: (id) => set((s) => ({ rewards: s.rewards.filter((r) => r.id !== id) })),

      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

      checkinDeeds: (kidId, deedIds) => {
        const { deeds } = get()
        const picked = deeds.filter((d) => deedIds.includes(d.id))
        const totalSpins = picked.reduce((sum, d) => sum + d.spinCount, 0)
        const entry: LogEntry = {
          id: uid(),
          kidId,
          ts: Date.now(),
          type: 'checkin',
          deeds: picked.map((d) => ({ deedId: d.id, name: d.name, spinCount: d.spinCount })),
          totalSpins,
        }
        set((s) => ({
          kids: s.kids.map((k) =>
            k.id === kidId ? { ...k, pendingSpins: k.pendingSpins + totalSpins } : k,
          ),
          log: [entry, ...s.log],
        }))
        return { totalSpins }
      },

      consumeSpin: (kidId, stars) => {
        const entry: LogEntry = { id: uid(), kidId, ts: Date.now(), type: 'spin', stars }
        set((s) => ({
          kids: s.kids.map((k) =>
            k.id === kidId
              ? {
                  ...k,
                  pendingSpins: Math.max(0, k.pendingSpins - 1),
                  totalStars: k.totalStars + stars,
                }
              : k,
          ),
          log: [entry, ...s.log],
        }))
      },

      redeemReward: (kidId, rewardId) => {
        const { kids, rewards } = get()
        const kid = kids.find((k) => k.id === kidId)
        const reward = rewards.find((r) => r.id === rewardId)
        if (!kid || !reward) return false
        if (kid.totalStars < reward.starCost) return false
        const entry: LogEntry = {
          id: uid(),
          kidId,
          ts: Date.now(),
          type: 'redeem',
          rewardId: reward.id,
          rewardName: reward.name,
          starCost: reward.starCost,
        }
        set((s) => ({
          kids: s.kids.map((k) =>
            k.id === kidId ? { ...k, totalStars: k.totalStars - reward.starCost } : k,
          ),
          log: [entry, ...s.log],
        }))
        return true
      },

      clearAllData: () =>
        set({
          kids: seedKids(),
          deeds: seedDeeds(),
          rewards: seedRewards(),
          log: [],
          settings: { parentPin: '1234', minStars: 5, maxStars: 10 },
        }),
    }),
    {
      name: 'diem-thuong-store-v1',
    },
  ),
)
