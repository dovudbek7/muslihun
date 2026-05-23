import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { Navigation, MapPin, Compass } from 'lucide-react'
import { useQibla } from '@/hooks/useQibla'
import { useDeviceCompass } from '@/hooks/useDeviceCompass'
import { cn } from '@/components/ui/cn'

const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

function CompassNeedle({ angle }: { angle: number }) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      animate={{ rotate: angle }}
      transition={{ type: 'spring', stiffness: 60, damping: 18 }}
    >
      {/* Kaaba icon at tip */}
      <div className="absolute top-[12%] flex flex-col items-center gap-0.5">
        <div className="w-5 h-5 bg-accent rounded-sm flex items-center justify-center shadow-lg shadow-accent/40">
          <span className="text-[8px] font-bold text-white">🕋</span>
        </div>
        <div className="w-0.5 h-[72px] bg-gradient-to-b from-accent to-accent/20 rounded-full" />
      </div>
      {/* South tip */}
      <div className="absolute bottom-[12%] flex flex-col items-center">
        <div className="w-0.5 h-[72px] bg-gradient-to-t from-border to-border/20 rounded-full" />
        <div className="w-2.5 h-2.5 rounded-full bg-border-subtle mt-0.5" />
      </div>
    </motion.div>
  )
}

function CompassRing({ children }: { children: React.ReactNode }) {
  const cardinals = ['N', 'E', 'S', 'W']
  const angles = [0, 90, 180, 270]

  return (
    <div className="relative w-72 h-72 lg:w-80 lg:h-80">
      {/* Outer decorative ring */}
      <div className="absolute inset-0 rounded-full border-2 border-border-subtle bg-bg-card shadow-2xl" />

      {/* Cardinal labels */}
      {cardinals.map((c, i) => {
        const rad = (angles[i] - 90) * (Math.PI / 180)
        const r = 130
        const x = 50 + (r / 144) * 50 * Math.cos(rad)
        const y = 50 + (r / 144) * 50 * Math.sin(rad)
        return (
          <span
            key={c}
            className={cn(
              'absolute text-xs font-semibold transform -translate-x-1/2 -translate-y-1/2',
              c === 'N' ? 'text-accent' : 'text-text-muted'
            )}
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            {c}
          </span>
        )
      })}

      {/* Tick marks */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 288 288">
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i * 10 - 90) * (Math.PI / 180)
          const isMajor = i % 9 === 0
          const r1 = isMajor ? 128 : 131
          const r2 = 137
          return (
            <line
              key={i}
              x1={144 + r1 * Math.cos(a)}
              y1={144 + r1 * Math.sin(a)}
              x2={144 + r2 * Math.cos(a)}
              y2={144 + r2 * Math.sin(a)}
              stroke={isMajor ? 'var(--color-border)' : 'var(--color-border-subtle)'}
              strokeWidth={isMajor ? 2 : 1}
            />
          )
        })}
      </svg>

      {/* Inner circle */}
      <div className="absolute inset-8 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center overflow-hidden">
        {children}
      </div>

      {/* Center dot */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-lg shadow-accent/50 z-10" />
      </div>
    </div>
  )
}

export function QiblaPage() {
  const { qiblaAngle, distance, loading, error } = useQibla()
  const { heading, hasGyroscope, needsPermission, requestPermission } = useDeviceCompass()

  const arrowAngle = useCallback(() => {
    if (qiblaAngle === null) return 0
    if (isTouchDevice && hasGyroscope && heading !== null) {
      return qiblaAngle - heading
    }
    return qiblaAngle
  }, [qiblaAngle, hasGyroscope, heading])

  const showStaticInfo = !isTouchDevice || !hasGyroscope

  return (
    <div className="flex flex-col items-center min-h-screen bg-bg-primary px-4 pt-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Compass size={18} className="text-accent" />
        <h1 className="text-text-primary font-semibold text-lg">Qibla</h1>
      </div>

      {qiblaAngle !== null && (
        <p className="text-accent font-bold text-3xl lg:text-4xl mb-1">
          {Math.round(qiblaAngle)}°
        </p>
      )}

      <p className="text-text-muted text-xs mb-8">
        {showStaticInfo ? "Shimoldan qibla yoʻnalishi" : "Qurilmangizni qibla tomon yoʻnaltiring"}
      </p>

      {/* Loading / Error states */}
      {loading && (
        <div className="flex flex-col items-center gap-3 mt-12">
          <div className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <p className="text-text-muted text-sm">Joylashuv aniqlanmoqda...</p>
        </div>
      )}

      {error && !loading && (
        <div className="mt-12 text-center px-6">
          <MapPin size={32} className="text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary text-sm mb-1">Joylashuv aniqlanmadi</p>
          <p className="text-text-muted text-xs">{error}</p>
        </div>
      )}

      {/* Compass */}
      {!loading && !error && qiblaAngle !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-8"
        >
          {/* iOS permission button */}
          {needsPermission && (
            <button
              onClick={requestPermission}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-medium shadow-lg shadow-accent/30 active:scale-95 transition-transform"
            >
              <Navigation size={15} />
              Kompasga ruxsat berish
            </button>
          )}

          <CompassRing>
            <CompassNeedle angle={arrowAngle()} />
          </CompassRing>

          {/* Distance */}
          {distance !== null && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 bg-bg-card border border-border-subtle rounded-2xl px-6 py-4"
            >
              <MapPin size={16} className="text-accent flex-shrink-0" />
              <div>
                <p className="text-text-muted text-xs mb-0.5">Makkadan masofa</p>
                <p className="text-text-primary font-semibold text-base">
                  {distance.toLocaleString()} km
                </p>
              </div>
            </motion.div>
          )}

          {/* Desktop static info */}
          {showStaticInfo && (
            <p className="text-text-muted text-xs text-center max-w-[240px]">
              Mobil qurilmada real kompas ishlaydi. Hozir statik yo'nalish ko'rsatilmoqda.
            </p>
          )}
        </motion.div>
      )}
    </div>
  )
}
