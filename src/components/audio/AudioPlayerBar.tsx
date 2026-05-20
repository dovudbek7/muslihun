import { Play, Pause, Square, Volume2, VolumeX, SkipForward, Repeat, Home, BookOpen, Brain, AlignJustify, User } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAudioStore } from '@/stores/audioStore'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { cn } from '@/components/ui/cn'

function formatTime(s: number): string {
  if (!isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

const NAV_ITEMS = [
  { path: '/', icon: Home, label: 'Bosh' },
  { path: '/read', icon: BookOpen, label: "Qur'on" },
  { path: '/hifz', icon: Brain, label: 'Hifz' },
  { path: '/tasbih', icon: AlignJustify, label: 'Tasbih' },
  { path: '/profile', icon: User, label: 'Profil' },
]

export function AudioPlayerBar() {
  const {
    isPlaying, isLoading, currentSurah, currentVerse,
    progress, duration, volume, isMuted, mode,
    pause, resume, stop, setVolume, toggleMute, setMode, nextVerse,
  } = useAudioStore()

  const { seek } = useAudioPlayer()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const progressPct = duration > 0 ? (progress / duration) * 100 : 0

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 safe-bottom">
      {/* Mini nav row — mobile only, desktop has sidebar */}
      <div className="lg:hidden flex bg-bg-card/95 backdrop-blur-sm border-t border-border-subtle">
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const active = path === '/' ? pathname === '/' : pathname.startsWith(path)
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                'flex-1 flex flex-col items-center justify-center py-1.5 gap-0.5 text-[9px] transition-colors',
                active ? 'text-accent' : 'text-text-muted hover:text-text-secondary'
              )}
            >
              <Icon size={16} />
              {label}
            </button>
          )
        })}
      </div>

      {/* Player controls */}
      <div className="mx-2 mb-1.5 bg-bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
        <div
          className="h-0.5 bg-bg-elevated cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const ratio = (e.clientX - rect.left) / rect.width
            seek(ratio * duration)
          }}
        >
          <div
            className="h-full bg-accent transition-all duration-100"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-text-muted">
              {currentVerse
                ? `${currentSurah}:${currentVerse}`
                : `Sura ${currentSurah}`}
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              {formatTime(progress)} / {formatTime(duration)}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setMode(mode === 'loop' ? 'single' : 'loop')}
              className={cn(
                'p-2 rounded-lg transition-colors',
                mode === 'loop'
                  ? 'text-accent bg-accent/10'
                  : 'text-text-muted hover:text-text-primary hover:bg-bg-elevated'
              )}
            >
              <Repeat size={15} />
            </button>

            <button
              onClick={isPlaying ? pause : resume}
              className="w-9 h-9 rounded-full bg-accent text-bg-primary flex items-center justify-center hover:bg-accent-light transition-colors"
            >
              {isLoading ? (
                <span className="w-3.5 h-3.5 border-2 border-bg-primary/40 border-t-bg-primary rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause size={16} />
              ) : (
                <Play size={16} className="ml-0.5" />
              )}
            </button>

            {currentVerse !== null && (
              <button
                onClick={nextVerse}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
              >
                <SkipForward size={15} />
              </button>
            )}

            <button
              onClick={stop}
              className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
            >
              <Square size={15} />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleMute}
              className="p-1 text-text-muted hover:text-text-primary transition-colors"
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 h-1 accent-accent cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
