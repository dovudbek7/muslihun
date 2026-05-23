import { useState, useEffect } from 'react'
import type { PrayerTimings } from '@/types/prayer'

const SKY: Record<string, string> = {
  night:     'linear-gradient(180deg, #080E1F 0%, #0D1A3A 55%, #141D35 100%)',
  dawn:      'linear-gradient(180deg, #0D1033 0%, #2D1B69 28%, #7B2D4E 54%, #D4622A 78%, #E89040 100%)',
  morning:   'linear-gradient(180deg, #E8904A 0%, #F4B566 18%, #87CEEB 55%, #4A90C4 100%)',
  midday:    'linear-gradient(180deg, #2160A8 0%, #4A9FD4 40%, #87CEEB 70%, #B8E0F4 100%)',
  afternoon: 'linear-gradient(180deg, #5AA8D8 0%, #A8D4EE 38%, #E8C870 72%, #E89040 100%)',
  sunset:    'linear-gradient(180deg, #E07832 0%, #C04030 25%, #8B2252 54%, #4A1A5C 74%, #1E0A2A 100%)',
}

function toMins(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function getPeriod(timings: PrayerTimings): string {
  const now = new Date().getHours() * 60 + new Date().getMinutes()
  const fajr    = toMins(timings.Fajr)
  const sunrise = toMins(timings.Sunrise)
  const dhuhr   = toMins(timings.Dhuhr)
  const asr     = toMins(timings.Asr)
  const maghrib = toMins(timings.Maghrib)
  const isha    = toMins(timings.Isha)

  if (now < fajr || now >= isha) return 'night'
  if (now < sunrise) return 'dawn'
  if (now < dhuhr)   return 'morning'
  if (now < asr)     return 'midday'
  if (now < maghrib) return 'afternoon'
  return 'sunset'
}

export function useSkyBackground(timings: PrayerTimings | null): string {
  const [bg, setBg] = useState(SKY.night)

  useEffect(() => {
    if (!timings) return
    const update = () => setBg(SKY[getPeriod(timings)])
    update()
    const id = setInterval(update, 60_000)
    return () => clearInterval(id)
  }, [timings])

  return bg
}
