import { bcp47For, useLocaleStore } from '../i18n'

export function dayKey(ts: number): string {
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function currentBcp47(): string {
  return bcp47For(useLocaleStore.getState().locale)
}

export function formatDay(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleDateString(currentBcp47(), {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatTime(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleTimeString(currentBcp47(), { hour: '2-digit', minute: '2-digit' })
}
