export interface PrayerTimings {
  Fajr: string
  Sunrise: string
  Dhuhr: string
  Asr: string
  Maghrib: string
  Isha: string
}

export interface NextPrayer {
  name: string
  time: string
  seconds_remaining: number
}

export interface PrayerTimesData {
  date: string
  latitude: number
  longitude: number
  method: number
  timings: PrayerTimings
  next_prayer?: NextPrayer
  fallback?: boolean
}

export type PrayerName = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha'

export const PRAYER_NAMES_UZ: Record<PrayerName, string> = {
  Fajr: 'Bomdod',
  Sunrise: 'Quyosh',
  Dhuhr: 'Peshin',
  Asr: 'Asr',
  Maghrib: 'Shom',
  Isha: 'Xufton',
}
