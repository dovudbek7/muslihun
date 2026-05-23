import { Settings } from 'lucide-react'
import { usePrayerCountdown } from '@/hooks/usePrayerTimes'
import { useSkyBackground } from '@/hooks/useSkyBackground'
import { useCityName } from '@/hooks/useCityName'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useUIStore } from '@/stores/uiStore'
import { getHijriDate } from '@/utils/hijriDate'
import { PrayerArc } from './PrayerArc'

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
      style={{ background, transition: 'background 8s ease', minHeight: 260 }}
    >
      {/* City + date row */}
      <div className="flex items-start justify-between px-5 pt-6 lg:pt-8">
        <div>
          <p className="text-white font-semibold text-base lg:text-lg leading-tight">{city || ' '}</p>
          <p className="text-white/65 text-xs lg:text-sm mt-0.5">{hijriDate}</p>
        </div>
        <button
          onClick={() => openDrawer('settings')}
          className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center active:scale-95 transition-transform"
        >
          <Settings size={16} className="text-white" />
        </button>
      </div>

      {/* Next prayer time + countdown */}
      <div className="text-center py-3">
        {countdown ? (
          <>
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="text-white text-[46px] lg:text-[56px] font-bold tracking-tight leading-none">
                {countdown.time}
              </span>
              <span className="text-white/70 text-xl lg:text-2xl font-medium">da</span>
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

      {/* Oval arc prayer timeline */}
      {timings ? (
        <PrayerArc timings={timings} countdown={countdown} />
      ) : (
        <div className="h-28 flex items-center justify-center">
          <div className="w-4/5 h-1 bg-white/10 rounded-full animate-pulse" />
        </div>
      )}

      <div className="pb-4" />
    </div>
  )
}
