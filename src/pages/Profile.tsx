import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  User, Flame, Trophy, LogOut, Moon, Sun, Monitor,
  Type, BookOpen,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useQuranStore } from '@/stores/quranStore'
import { useUIStore, type Theme } from '@/stores/uiStore'
import { useProfile, useLogout, useUpdatePreferences } from '@/api/auth'
import { useStreak, useMyAchievements } from '@/api/gamification'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/components/ui/cn'
import type { Language } from '@/types/quran'

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Русский' },
  { value: 'uz_latin', label: "O'zbekcha" },
  { value: 'uz_cyrillic', label: 'Ўзбекча' },
  { value: 'tr', label: 'Türkçe' },
]

const THEMES: { id: Theme; label: string; icon: React.ReactNode }[] = [
  { id: 'light', label: 'Oq', icon: <Sun size={16} /> },
  { id: 'dark', label: 'Qora', icon: <Moon size={16} /> },
  { id: 'gray', label: 'Kulrang', icon: <Monitor size={16} /> },
]

export function Profile() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const {
    language, tajweedMode, arabicOnly, showTransliteration,
    setLanguage, toggleTajweedMode, toggleArabicOnly, toggleTransliteration,
  } = useQuranStore()
  const { theme, setTheme } = useUIStore()

  const { data: user } = useProfile()
  const { data: streak } = useStreak()
  const { data: achievements } = useMyAchievements()
  const logout = useLogout()

  async function handleLogout() {
    try {
      await logout.mutateAsync()
    } catch {
      // token noto'g'ri bo'lsa ham — onSettled ichida tozalanadi
    }
    navigate(ROUTES.LOGIN)
  }

  return (
    <div className="px-4 py-6 space-y-6">
      {isAuthenticated && user ? (
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
            <User size={24} className="text-accent" />
          </div>
          <div>
            <p className="text-text-primary font-semibold text-lg">{user.username}</p>
            <p className="text-text-muted text-sm">{user.email}</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate(ROUTES.LOGIN)}
            className="w-full py-3 bg-accent text-bg-primary rounded-xl font-medium text-sm"
          >
            Kirish
          </button>
          <button
            onClick={() => navigate(ROUTES.REGISTER)}
            className="w-full py-3 bg-bg-elevated border border-border-subtle rounded-xl text-text-secondary text-sm"
          >
            Ro'yxatdan o'tish
          </button>
        </div>
      )}

      {streak && (
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<Flame size={16} className="text-amber-400" />}
            value={streak.current_streak}
            label="Kunlik zanjir"
            color="amber"
          />
          <StatCard
            icon={<Trophy size={16} className="text-accent" />}
            value={streak.longest_streak}
            label="Rekord"
            color="gold"
          />
          <StatCard
            icon={<BookOpen size={16} className="text-blue-400" />}
            value={achievements?.length ?? 0}
            label="Yutuqlar"
            color="blue"
          />
        </div>
      )}

      <Section title="Ko'rinish">
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={cn(
                'flex flex-col items-center gap-2 py-3 rounded-xl border-2 transition-all',
                'bg-bg-elevated',
                theme === t.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-muted hover:text-text-primary'
              )}
            >
              {t.icon}
              <span className="text-xs font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="O'qish sozlamalari">
        <div className="space-y-px">
          <ToggleRow
            icon={<BookOpen size={15} />}
            label="Faqat arabcha"
            value={arabicOnly}
            onToggle={toggleArabicOnly}
          />
          <ToggleRow
            icon={<Type size={15} />}
            label="Transliteratsiya"
            value={showTransliteration}
            onToggle={toggleTransliteration}
          />
          <ToggleRow
            icon={<Sun size={15} />}
            label="Tajweed ranglari"
            value={tajweedMode}
            onToggle={toggleTajweedMode}
          />
        </div>
      </Section>

      <Section title="Tarjima tili">
        <div className="grid grid-cols-2 gap-2">
          {LANGUAGES.map(lang => (
            <button
              key={lang.value}
              onClick={() => setLanguage(lang.value)}
              className={cn(
                'py-2.5 px-3 rounded-xl text-sm font-medium border transition-all',
                language === lang.value
                  ? 'bg-accent/10 border-accent/30 text-accent'
                  : 'bg-bg-elevated border-border-subtle text-text-secondary hover:text-text-primary'
              )}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </Section>

      {isAuthenticated && (
        <button
          onClick={handleLogout}
          disabled={logout.isPending}
          className="w-full flex items-center justify-center gap-2 py-3 bg-red-400/10 border border-red-400/20 rounded-xl text-red-400 text-sm font-medium hover:bg-red-400/15 transition-colors"
        >
          <LogOut size={15} />
          Chiqish
        </button>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-text-muted text-xs uppercase tracking-wider mb-3">{title}</p>
      {children}
    </div>
  )
}

function StatCard({
  icon, value, label, color,
}: {
  icon: React.ReactNode
  value: number
  label: string
  color: 'amber' | 'gold' | 'blue'
}) {
  const colors = {
    amber: 'bg-amber-400/10 border-amber-400/20',
    gold: 'bg-accent/10 border-accent/20',
    blue: 'bg-blue-400/10 border-blue-400/20',
  }
  return (
    <div className={cn('rounded-xl p-3 border', colors[color])}>
      <div className="flex items-center gap-1 mb-1">{icon}</div>
      <p className="text-text-primary font-bold text-xl">{value}</p>
      <p className="text-text-muted text-xs leading-tight mt-0.5">{label}</p>
    </div>
  )
}

function ToggleRow({
  icon, label, value, onToggle,
}: {
  icon: React.ReactNode
  label: string
  value: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 px-4 py-3 bg-bg-elevated first:rounded-t-xl last:rounded-b-xl hover:bg-bg-hover transition-colors"
    >
      <span className="text-text-muted">{icon}</span>
      <span className="flex-1 text-sm text-text-secondary text-left">{label}</span>
      <div className={cn(
        'w-11 h-6 rounded-full transition-colors relative flex-shrink-0',
        value ? 'bg-accent' : 'bg-bg-hover border border-border'
      )}>
        <motion.div
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
          animate={{ left: value ? '1.375rem' : '0.125rem' }}
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        />
      </div>
    </button>
  )
}
