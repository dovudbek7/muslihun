import { NavLink } from 'react-router-dom'
import { BookOpen, Search, Brain, Mic, User, Settings2 } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/components/ui/cn'

const NAV_ITEMS = [
  { to: '/', icon: BookOpen, label: "Qur'on" },
  { to: '/search', icon: Search, label: 'Qidiruv' },
  { to: '/hifz', icon: Brain, label: 'Hifz' },
  { to: '/recite/1', icon: Mic, label: 'Qiroat' },
  { to: '/profile', icon: User, label: 'Profil' },
]

export function Sidebar() {
  const { openDrawer } = useUIStore()

  return (
    <aside className="hidden lg:flex flex-col w-20 xl:w-56 min-h-dvh border-r border-border-subtle bg-bg-secondary sticky top-0 flex-shrink-0">
      <div className="flex items-center justify-center xl:justify-start px-4 h-16 border-b border-border-subtle">
        <span className="font-arabic text-accent text-2xl">مسلم</span>
        <span className="hidden xl:block ml-2 text-text-primary font-semibold text-base">Muslihun</span>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} className="flex-shrink-0" />
                <span className="hidden xl:block text-sm font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-border-subtle">
        <button
          onClick={() => openDrawer('settings')}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-muted hover:text-text-secondary hover:bg-bg-elevated transition-all w-full"
        >
          <Settings2 size={20} strokeWidth={1.8} className="flex-shrink-0" />
          <span className="hidden xl:block text-sm font-medium">Sozlamalar</span>
        </button>
      </div>
    </aside>
  )
}
