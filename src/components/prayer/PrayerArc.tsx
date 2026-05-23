import { Moon, Sunrise as SunriseIcon, Sun, CloudSun, Sunset as SunsetIcon } from 'lucide-react'
import type { PrayerTimings, NextPrayer, PrayerName } from '@/types/prayer'

const PRAYERS: Array<{ key: PrayerName; label: string; Icon: React.ElementType }> = [
  { key: 'Fajr',    label: 'Bomdod', Icon: Moon },
  { key: 'Sunrise', label: 'Quyosh', Icon: SunriseIcon },
  { key: 'Dhuhr',   label: 'Peshin', Icon: Sun },
  { key: 'Asr',     label: 'Asr',    Icon: CloudSun },
  { key: 'Maghrib', label: 'Shom',   Icon: SunsetIcon },
  { key: 'Isha',    label: 'Xufton', Icon: Moon },
]

// Cubic bezier — oval arc shape
// viewBox 0 0 360 68
const B = { x0: 18, y0: 62, cx1: 88, cy1: 4, cx2: 272, cy2: 4, x3: 342, y3: 62 }
const VBW = 360
const VBH = 68

function bezier(t: number): [number, number] {
  const m = 1 - t
  return [
    m**3*B.x0 + 3*m**2*t*B.cx1 + 3*m*t**2*B.cx2 + t**3*B.x3,
    m**3*B.y0 + 3*m**2*t*B.cy1 + 3*m*t**2*B.cy2 + t**3*B.y3,
  ]
}

function toMins(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

const ICON_H = 18   // px above dot
const LABEL_H = 30  // px below dot (name + time)
const CONTAINER_H = ICON_H + VBH + LABEL_H  // ~116px

interface Props { timings: PrayerTimings; countdown: NextPrayer | null }

export function PrayerArc({ timings, countdown }: Props) {
  const fM = toMins(timings.Fajr)
  const iM = toMins(timings.Isha)
  const span = iM - fM

  const now = new Date()
  const nowM = now.getHours() * 60 + now.getMinutes()
  const nowT = Math.max(0, Math.min(1, (nowM - fM) / span))
  const [nowX, nowY] = bezier(nowT)
  const showPointer = nowM >= fM && nowM <= iM

  const points = PRAYERS.map(p => {
    const timeStr = timings[p.key as keyof PrayerTimings] ?? timings.Fajr
    const t = Math.max(0, Math.min(1, (toMins(timeStr) - fM) / span))
    const [bx, by] = bezier(t)
    return { ...p, t, bx, by, time: timeStr, isNext: countdown?.name === p.key }
  })

  return (
    <div className="relative" style={{ height: CONTAINER_H }}>
      {/* Oval arc SVG */}
      <svg
        viewBox={`0 0 ${VBW} ${VBH}`}
        style={{ position: 'absolute', top: ICON_H, left: 0, width: '100%', height: VBH }}
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="arc-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dashed arc */}
        <path
          d={`M ${B.x0} ${B.y0} C ${B.cx1} ${B.cy1}, ${B.cx2} ${B.cy2}, ${B.x3} ${B.y3}`}
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="1.5"
          strokeDasharray="3 5"
        />

        {/* Prayer position dots */}
        {points.map(p => (
          <circle
            key={p.key}
            cx={p.bx}
            cy={p.by}
            r={p.isNext ? 4.5 : 2.5}
            fill={p.isNext ? 'white' : 'rgba(255,255,255,0.4)'}
          />
        ))}

        {/* Current time pointer — moves along arc */}
        {showPointer && (
          <circle cx={nowX} cy={nowY} r="6" fill="white" filter="url(#arc-glow)" />
        )}
      </svg>

      {/* Icons + labels absolutely positioned per prayer */}
      {points.map(p => {
        const xPct = (p.bx / VBW) * 100
        const dotTop = ICON_H + p.by
        const { Icon } = p
        const active = p.isNext
        return (
          <div key={p.key}>
            {/* Icon above dot */}
            <div
              className="absolute"
              style={{ left: `${xPct}%`, top: dotTop - ICON_H + 2, transform: 'translateX(-50%)' }}
            >
              <Icon size={13} className={active ? 'text-white' : 'text-white/45'} />
            </div>
            {/* Name + time below dot */}
            <div
              className="absolute flex flex-col items-center"
              style={{ left: `${xPct}%`, top: dotTop + 6, transform: 'translateX(-50%)' }}
            >
              <span className={`text-[9px] font-bold leading-tight whitespace-nowrap ${active ? 'text-white' : 'text-white/55'}`}>
                {p.label}
              </span>
              <span className={`text-[8px] font-mono leading-tight ${active ? 'text-white' : 'text-white/40'}`}>
                {p.time}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
