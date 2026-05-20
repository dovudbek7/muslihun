import { motion, AnimatePresence } from 'framer-motion'
import { usePrayerCountdown, formatCountdown } from '@/hooks/usePrayerTimes'
import { PRAYER_NAMES_UZ } from '@/types/prayer'

export function PrayerCountdown() {
  const { countdown } = usePrayerCountdown()

  if (!countdown) {
    return (
      <div className="flex flex-col items-start gap-0.5">
        <div className="h-3 w-24 bg-bg-elevated rounded shimmer" />
        <div className="h-2.5 w-16 bg-bg-elevated rounded shimmer" />
      </div>
    )
  }

  const prayerLabel = PRAYER_NAMES_UZ[countdown.name as keyof typeof PRAYER_NAMES_UZ] || countdown.name

  return (
    <div className="flex flex-col items-start gap-0.5">
      <AnimatePresence mode="wait">
        <motion.p
          key={countdown.seconds_remaining}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-mono text-accent tracking-wide"
        >
          {prayerLabel} {formatCountdown(countdown.seconds_remaining)}
        </motion.p>
      </AnimatePresence>
      <p className="text-[10px] text-text-muted">Keyingi namoz</p>
    </div>
  )
}

export function CurrentPrayer() {
  const { countdown, timings } = usePrayerCountdown()

  if (!timings || !countdown) return null

  const prayers = [
    ['Fajr', timings.Fajr],
    ['Dhuhr', timings.Dhuhr],
    ['Asr', timings.Asr],
    ['Maghrib', timings.Maghrib],
    ['Isha', timings.Isha],
  ] as const

  const now = new Date()
  const currentHM = now.getHours() * 60 + now.getMinutes()

  let current = prayers[prayers.length - 1]
  for (let i = 0; i < prayers.length - 1; i++) {
    const [, time] = prayers[i]
    if (!time) continue
    const [h, m] = time.split(':').map(Number)
    const nextEntry = prayers[i + 1]
    const [, nextTime] = nextEntry
    if (!nextTime) continue
    const [nh, nm] = nextTime.split(':').map(Number)
    const pM = h * 60 + m
    const npM = nh * 60 + nm
    if (currentHM >= pM && currentHM < npM) {
      current = prayers[i]
      break
    }
  }

  const [name, time] = current
  const label = PRAYER_NAMES_UZ[name as keyof typeof PRAYER_NAMES_UZ] || name

  return (
    <div className="flex flex-col items-end gap-0.5">
      <p className="text-xs font-medium text-text-primary">{label} {time}</p>
      <p className="text-[10px] text-text-muted">Joriy vaqt</p>
    </div>
  )
}
