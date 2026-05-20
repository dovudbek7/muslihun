import { useState, useEffect, useCallback } from 'react'
import { useGeolocation } from './useGeolocation'
import { usePrayerTimes as usePrayerTimesQuery } from '@/api/prayer'
import type { NextPrayer } from '@/types/prayer'

export function usePrayerCountdown() {
  const { latitude, longitude } = useGeolocation()
  const { data } = usePrayerTimesQuery(latitude, longitude)
  const [countdown, setCountdown] = useState<NextPrayer | null>(null)

  const computeNext = useCallback(() => {
    if (!data?.timings) return
    const now = new Date()
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const

    for (const name of prayers) {
      const timeStr = data.timings[name]
      if (!timeStr) continue
      const [h, m] = timeStr.split(':').map(Number)
      const prayerTime = new Date()
      prayerTime.setHours(h, m, 0, 0)

      if (prayerTime > now) {
        const seconds = Math.floor((prayerTime.getTime() - now.getTime()) / 1000)
        setCountdown({ name, time: timeStr, seconds_remaining: seconds })
        return
      }
    }

    const fajr = data.timings.Fajr
    if (fajr) {
      const [h, m] = fajr.split(':').map(Number)
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(h, m, 0, 0)
      const seconds = Math.floor((tomorrow.getTime() - now.getTime()) / 1000)
      setCountdown({ name: 'Fajr', time: fajr, seconds_remaining: seconds })
    }
  }, [data])

  useEffect(() => {
    computeNext()
    const interval = setInterval(computeNext, 1000)
    return () => clearInterval(interval)
  }, [computeNext])

  return { countdown, timings: data?.timings ?? null }
}

export function formatCountdown(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}
