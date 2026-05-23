import { Moon, Sun, Sunrise, Sunset, CloudSun, Settings } from 'lucide-react'
import { usePrayerCountdown } from '@/hooks/usePrayerTimes'
import { useSkyBackground } from '@/hooks/useSkyBackground'
import { useCityName } from '@/hooks/useCityName'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useUIStore } from '@/stores/uiStore'
import { getHijriDate } from '@/utils/hijriDate'
import { PRAYER_NAMES_UZ } from '@/types/prayer'
import type { PrayerName } from '@/types/prayer'

const PRAYERS: Array<{ key: PrayerName; Icon: React.ElementType }> = [
  { key: 'Fajr',    Icon: Moon },
  { key: 'Sunrise', Icon: Sunrise },
  { key: 'Dhuhr',   Icon: Sun },
  { key: 'Asr',     Icon: CloudSun },
  { key: 'Maghrib', Icon: Sunset },
  { key: 'Isha',    Icon: Moon },
]

function fmt(s: number) {
  const h = String(Math.floor(s / 3600)).padStart(2, '0')
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
  const sec = String(s % 60).padStart(2, '0')
  return `${h}:${m}:${sec}`
}

export function PrayerTimesWidget() {
  const { latitude, longitude } = useGeolocation()
  const { countdown, timings } = usePrayerCountdown()
  const background = useSkyBackground(timings)
  const city = useCityName(latitude, longitude)
  const { openDrawer } = useUIStore()
  const hijriDate = getHijriDate()

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{ background, minHeight: 268, transition: 'background 8s ease' }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between px-5 pt-12">
        <div>
          <p className="text-white font-semibold text-base leading-tight">
            {city || ' '}
          </p>
          <p className="text-white/65 text-xs mt-0.5">{hijriDate}</p>
        </div>
        <button
          onClick={() => openDrawer('settings')}
          className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center active:scale-95 transition-transform"
        >
          <Settings size={16} className="text-white" />
        </button>
      </div>

      {/* Next prayer + countdown */}
      <div className="text-center py-3">
        {countdown ? (
          <>
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="text-white text-[46px] font-bold tracking-tight leading-none">
                {countdown.time}
              </span>
              <span className="text-white/70 text-xl font-medium">da</span>
            </div>
            <p className="text-white/65 text-sm mt-1 font-mono tracking-wider">
              {fmt(countdown.seconds_remaining)} qoldi
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="h-11 w-36 bg-white/10 rounded-xl animate-pulse" />
            <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
          </div>
        )}
      </div>

      {/* Prayer timeline */}
      {timings && (
        <div className="px-3 pb-6">
          <div className="relative flex items-start justify-between">
            {/* Dashed connector line */}
            <div className="absolute left-6 right-6 top-[22px] border-t border-dashed border-white/25 pointer-events-none" />

            {PRAYERS.map(({ key, Icon }) => {
              const isNext = countdown?.name === key
              const time = timings[key as keyof typeof timings]
              const name = PRAYER_NAMES_UZ[key as keyof typeof PRAYER_NAMES_UZ]
              return (
                <div key={key} className="flex flex-col items-center gap-1 z-10 w-[16%]">
                  <Icon
                    size={15}
                    className={isNext ? 'text-white' : 'text-white/45'}
                  />
                  <div
                    className={`rounded-full mt-0.5 transition-all ${
                      isNext ? 'w-3 h-3 bg-white shadow-[0_0_6px_2px_rgba(255,255,255,0.5)]' : 'w-1.5 h-1.5 bg-white/35'
                    }`}
                  />
                  <p className={`text-[10px] font-semibold leading-tight text-center ${isNext ? 'text-white' : 'text-white/55'}`}>
                    {name}
                  </p>
                  <p className={`text-[9px] font-mono leading-tight ${isNext ? 'text-white' : 'text-white/45'}`}>
                    {time}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
