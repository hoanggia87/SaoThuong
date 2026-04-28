import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { vi } from './locales/vi'
import { en } from './locales/en'
import { ja } from './locales/ja'
import { zh } from './locales/zh'
import { ko } from './locales/ko'
import { SUPPORTED_LOCALES, type Locale, type Translations } from './types'

export type { Locale, Translations } from './types'
export { SUPPORTED_LOCALES } from './types'

const TRANSLATIONS: Record<Locale, Translations> = { vi, en, ja, zh, ko }

const LOCALE_TO_BCP47: Record<Locale, string> = {
  vi: 'vi-VN',
  en: 'en-US',
  ja: 'ja-JP',
  zh: 'zh-CN',
  ko: 'ko-KR',
}

function detectLocale(): Locale {
  if (typeof navigator === 'undefined') return 'en'
  const candidates: string[] = []
  if (navigator.languages?.length) candidates.push(...navigator.languages)
  if (navigator.language) candidates.push(navigator.language)
  for (const raw of candidates) {
    const lower = raw.toLowerCase()
    const base = lower.split('-')[0]
    if (SUPPORTED_LOCALES.includes(base as Locale)) return base as Locale
  }
  return 'en'
}

type LocaleState = {
  locale: Locale
  setLocale: (l: Locale) => void
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: detectLocale(),
      setLocale: (l) => set({ locale: l }),
    }),
    { name: 'diem-thuong-locale-v1' },
  ),
)

function format(template: string, params?: Record<string, string | number>): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (_, k) =>
    params[k] === undefined ? `{${k}}` : String(params[k]),
  )
}

export function useT() {
  const locale = useLocaleStore((s) => s.locale)
  const dict = TRANSLATIONS[locale] ?? TRANSLATIONS.en
  const t = (template: string, params?: Record<string, string | number>) =>
    format(template, params)
  return { t, dict, locale }
}

export function useLocale() {
  return useLocaleStore((s) => s.locale)
}

export function bcp47For(locale: Locale): string {
  return LOCALE_TO_BCP47[locale]
}

export function getDict(locale: Locale): Translations {
  return TRANSLATIONS[locale] ?? TRANSLATIONS.en
}
