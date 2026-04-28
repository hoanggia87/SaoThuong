import { useStore } from '../store'
import { Button } from '../components/Button'
import { dayKey, formatDay, formatTime } from '../lib/date'
import type { LogEntry } from '../types'
import { useMemo } from 'react'
import { useT } from '../i18n'

type Props = {
  kidId: string
  onBack: () => void
}

export function History({ kidId, onBack }: Props) {
  const kid = useStore((s) => s.kids.find((k) => k.id === kidId))
  const log = useStore((s) => s.log)
  const { t, dict } = useT()

  const grouped = useMemo(() => {
    const filtered = log.filter((e) => e.kidId === kidId)
    const map = new Map<string, LogEntry[]>()
    for (const e of filtered) {
      const k = dayKey(e.ts)
      const arr = map.get(k) ?? []
      arr.push(e)
      map.set(k, arr)
    }
    return Array.from(map.entries())
  }, [log, kidId])

  if (!kid) return null

  return (
    <div className="min-h-full flex flex-col p-4 sm:p-10 overflow-y-auto">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <Button variant="gray" size="sm" onClick={onBack}>
          {dict.common.back}
        </Button>
        <h1 className="text-xl sm:text-4xl font-display font-extrabold flex-1 truncate">
          {t(dict.history.title, { name: kid.name })}
        </h1>
      </div>

      {grouped.length === 0 ? (
        <div className="text-center text-slate-500 mt-20 text-base sm:text-xl">
          {dict.history.empty}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto w-full space-y-4 sm:space-y-6">
          {grouped.map(([day, entries]) => {
            const ts = entries[0].ts
            const dayStars = entries
              .filter((e) => e.type === 'spin')
              .reduce((sum, e) => sum + (e as Extract<LogEntry, { type: 'spin' }>).stars, 0)
            const daySpinsEarned = entries
              .filter((e) => e.type === 'checkin')
              .reduce(
                (sum, e) => sum + (e as Extract<LogEntry, { type: 'checkin' }>).totalSpins,
                0,
              )
            const dayRedeems = entries.filter((e) => e.type === 'redeem').length
            return (
              <div key={day} className="bg-white rounded-2xl sm:rounded-3xl shadow-toy-sm p-3.5 sm:p-5">
                <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                  <div className="font-display font-extrabold text-base sm:text-xl">{formatDay(ts)}</div>
                  <div className="flex gap-1.5 sm:gap-2 text-xs sm:text-sm flex-wrap">
                    {daySpinsEarned > 0 && (
                      <span className="bg-candy-green/20 text-emerald-700 px-2 py-1 rounded-full font-bold">
                        🎰 +{daySpinsEarned}
                      </span>
                    )}
                    {dayStars > 0 && (
                      <span className="bg-candy-yellow/30 text-amber-800 px-2 py-1 rounded-full font-bold">
                        ⭐ +{dayStars}
                      </span>
                    )}
                    {dayRedeems > 0 && (
                      <span className="bg-candy-purple/20 text-purple-700 px-2 py-1 rounded-full font-bold">
                        🎁 {dayRedeems}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {entries.map((e) => (
                    <Row key={e.id} e={e} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Row({ e }: { e: LogEntry }) {
  const { t, dict } = useT()
  if (e.type === 'checkin') {
    return (
      <div className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-emerald-50">
        <div className="text-xl sm:text-2xl shrink-0">✅</div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm sm:text-base">
            {dict.history.deedsPrefix} {e.deeds.map((d) => d.name).join(', ')}
          </div>
          <div className="text-xs sm:text-sm text-slate-500">
            {t(dict.history.spinsEarned, { count: e.totalSpins })} · {formatTime(e.ts)}
          </div>
        </div>
      </div>
    )
  }
  if (e.type === 'spin') {
    return (
      <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-amber-50">
        <div className="text-xl sm:text-2xl shrink-0">🎰</div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm sm:text-base">{t(dict.history.spinResult, { count: e.stars })}</div>
          <div className="text-xs sm:text-sm text-slate-500">{formatTime(e.ts)}</div>
        </div>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-purple-50">
      <div className="text-xl sm:text-2xl shrink-0">🎁</div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm sm:text-base">{t(dict.history.redeemPrefix, { name: e.rewardName })}</div>
        <div className="text-xs sm:text-sm text-slate-500">
          -{e.starCost} ⭐ · {formatTime(e.ts)}
        </div>
      </div>
    </div>
  )
}
