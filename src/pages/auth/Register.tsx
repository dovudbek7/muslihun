import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useRegister } from '@/api/auth'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/components/ui/cn'

interface FormState {
  email: string
  username: string
  password: string
  password_confirm: string
}

export function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>({
    email: '', username: '', password: '', password_confirm: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Partial<FormState & { general: string }>>({})
  const register = useRegister()

  function update(field: keyof FormState, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    if (form.password !== form.password_confirm) {
      setErrors({ password_confirm: 'Parollar mos kelmadi' })
      return
    }
    if (form.password.length < 8) {
      setErrors({ password: "Parol kamida 8 ta belgidan iborat bo'lishi kerak" })
      return
    }

    try {
      await register.mutateAsync({
        email: form.email,
        username: form.username,
        password: form.password,
        password_confirm: form.password_confirm,
      })
      navigate(ROUTES.HOME, { replace: true })
    } catch (err: any) {
      const data = err?.response?.data
      if (data?.fields) {
        setErrors({
          email: data.fields.email?.[0],
          username: data.fields.username?.[0],
          password: data.fields.password?.[0],
        })
      } else {
        setErrors({ general: data?.error || 'Xato yuz berdi' })
      }
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
          <p className="text-text-muted text-sm">Yangi hisob yarating</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Email" error={errors.email}>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="email@example.com"
                required
                autoComplete="email"
                className={inputCls(!!errors.email)}
              />
            </div>
          </Field>

          <Field label="Foydalanuvchi nomi" error={errors.username}>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={form.username}
                onChange={(e) => update('username', e.target.value)}
                placeholder="username"
                required
                autoComplete="username"
                className={inputCls(!!errors.username)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </Field>

          <Field label="Parol" error={errors.password}>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                placeholder="Kamida 8 belgi"
                required
                autoComplete="new-password"
                className={cn(inputCls(!!errors.password), 'pr-10')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </Field>

          <Field label="Parolni tasdiqlash" error={errors.password_confirm}>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password_confirm}
                onChange={(e) => update('password_confirm', e.target.value)}
                placeholder="Parolni qayta kiriting"
                required
                autoComplete="new-password"
                className={inputCls(!!errors.password_confirm)}
              />
            </div>
          </Field>

          {errors.general && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-xs pl-1"
            >
              {errors.general}
            </motion.p>
          )}

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={register.isPending}
            className="w-full py-3.5 rounded-xl font-medium text-sm bg-accent text-bg-primary disabled:opacity-50 transition-all mt-2"
          >
            {register.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-bg-primary/40 border-t-bg-primary rounded-full animate-spin" />
                Yaratilmoqda...
              </span>
            ) : (
              'Hisob yaratish'
            )}
          </motion.button>
        </form>

        <p className="text-center text-text-muted text-sm mt-6">
          Hisob bormi?{' '}
          <Link to={ROUTES.LOGIN} className="text-accent hover:text-accent-light transition-colors">
            Kirish
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

function Field({
  label, error, children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <label className="text-text-secondary text-xs font-medium pl-1">{label}</label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-red-400 text-xs pl-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

function inputCls(hasError: boolean) {
  return cn(
    'w-full pl-10 pr-4 py-3 bg-bg-elevated border rounded-xl',
    'text-text-primary placeholder-text-muted text-sm outline-none transition-colors',
    hasError
      ? 'border-red-400/50 focus:border-red-400'
      : 'border-border-subtle focus:border-accent/50'
  )
}
