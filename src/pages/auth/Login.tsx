import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useLogin } from '@/api/auth'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/components/ui/cn'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const login = useLogin()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await login.mutateAsync({ email, password })
      navigate(ROUTES.HOME, { replace: true })
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Email yoki parol noto'g'ri")
    }
  }

  return (
    <div className="min-h-dvh bg-bg-primary flex flex-col items-center justify-center px-4 safe-top safe-bottom">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <h1 className="font-arabic text-text-arabic text-4xl mb-2">مُصْلِحُون</h1>
          <p className="text-text-muted text-sm">Hisobingizga kiring</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-text-secondary text-xs font-medium pl-1">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                autoComplete="email"
                className={cn(
                  'w-full pl-10 pr-4 py-3 bg-bg-elevated border border-border-subtle rounded-xl',
                  'text-text-primary placeholder-text-muted text-sm outline-none',
                  'focus:border-accent/50 transition-colors'
                )}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-text-secondary text-xs font-medium pl-1">Parol</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className={cn(
                  'w-full pl-10 pr-10 py-3 bg-bg-elevated border border-border-subtle rounded-xl',
                  'text-text-primary placeholder-text-muted text-sm outline-none',
                  'focus:border-accent/50 transition-colors'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-red-400 text-xs pl-1"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={login.isPending || !email || !password}
            className={cn(
              'w-full py-3.5 rounded-xl font-medium text-sm transition-all',
              'bg-accent text-bg-primary',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {login.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-bg-primary/40 border-t-bg-primary rounded-full animate-spin" />
                Kirish...
              </span>
            ) : (
              'Kirish'
            )}
          </motion.button>
        </form>

        <p className="text-center text-text-muted text-sm mt-6">
          Hisob yo'qmi?{' '}
          <Link to={ROUTES.REGISTER} className="text-accent hover:text-accent-light transition-colors">
            Ro'yxatdan o'tish
          </Link>
        </p>

        <div className="mt-4 text-center">
          <Link
            to={ROUTES.HOME}
            className="text-text-muted text-sm hover:text-text-secondary transition-colors"
          >
            Mehmon sifatida davom etish →
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
