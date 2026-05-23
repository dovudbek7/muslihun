import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/config/api'
import type { User, LoginPayload, RegisterPayload, LoginResponse, RegisterResponse, UserPreferences } from '@/types/auth'
import { useAuthStore } from '@/stores/authStore'

export function useLogin() {
  const { setAuth } = useAuthStore()
  const qc = useQueryClient()

  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: (payload) => api.post('/auth/login/', payload).then(r => r.data),
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)
      setAuth(data.user, data.access, data.refresh)
      qc.setQueryData(['auth', 'me'], data.user)
    },
  })
}

export function useRegister() {
  const { setAuth } = useAuthStore()

  return useMutation<RegisterResponse, Error, RegisterPayload>({
    mutationFn: (payload) => api.post('/auth/register/', payload).then(r => r.data),
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.tokens.access)
      localStorage.setItem('refresh_token', data.tokens.refresh)
      setAuth(data.user, data.tokens.access, data.tokens.refresh)
    },
  })
}

export function useLogout() {
  const { clearAuth } = useAuthStore()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const refresh = localStorage.getItem('refresh_token')
      try {
        await api.post('/auth/logout/', { refresh })
      } catch {
        // Server-side logout failure — still clear client state
      }
    },
    onSettled: () => {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      clearAuth()
      qc.clear()
    },
  })
}

export function useProfile() {
  const { isAuthenticated } = useAuthStore()
  return useQuery<User>({
    queryKey: ['auth', 'me'],
    queryFn: () => api.get('/auth/profile/').then(r => r.data),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdatePreferences() {
  const qc = useQueryClient()
  const { updateUser } = useAuthStore()

  return useMutation<User, Error, UserPreferences>({
    mutationFn: (prefs) => api.patch('/auth/preferences/', prefs).then(r => r.data),
    onSuccess: (user) => {
      qc.setQueryData(['auth', 'me'], user)
      updateUser(user)
    },
  })
}

export function useUpdateLastRead() {
  return useMutation({
    mutationFn: (payload: { surah: number; verse: number; page: number }) =>
      api.post('/auth/last-read/', payload).then(r => r.data),
  })
}
