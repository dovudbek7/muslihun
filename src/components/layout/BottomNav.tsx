import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Search, Brain, Hash, User } from 'lucide-react'
import { useQuranStore } from '@/stores/quranStore'
import { cn } from '@/components/ui/cn'

const NAV_ITEMS = [
  { to: '/', icon: BookOpen, label: 'Qur\'on' },
  { to: '/search', icon: Search, label: 'Qidiruv' },
  { to: '/hifz', icon: Brain, label: 'Hifz' },
  { to: '/tasbih', icon: Hash, label: 'Tasbih' },
  { to: '/profile', icon: User, label: 'Profil' },
]

export function BottomNav() {
  const { zenMode } = useQuranStore()
  if (zenMode) return null

  return (
    <motion.nav
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-bg-primary/95 backdrop-blur-md border-t border-border-subtle safe-bottom"
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 px-3 py-1 rounded-xl min-w-[52px]',
                'transition-all duration-200',
                isActive
                  ? 'text-accent'
                  : 'text-text-muted hover:text-text-secondary'
              )
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className={cn(
                    'p-1.5 rounded-lg transition-colors',
                    isActive ? 'bg-accent/10' : ''
                  )}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                </motion.div>
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </motion.nav>
  )
}
