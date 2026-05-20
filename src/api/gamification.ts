import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/config/api'
import type {
  Streak, TasbihDhikr, TasbihSession,
  Achievement, UserAchievement, GamificationDashboard,
  TasbihIncrementResponse,
} from '@/types/gamification'

export const gamificationKeys = {
  streak: ['gamification', 'streak'] as const,
  dhikrList: ['gamification', 'dhikr'] as const,
  sessions: ['gamification', 'tasbih', 'sessions'] as const,
  achievements: ['gamification', 'achievements'] as const,
  myAchievements: ['gamification', 'achievements', 'mine'] as const,
  dashboard: ['gamification', 'dashboard'] as const,
}

export function useStreak() {
  return useQuery<Streak>({
    queryKey: gamificationKeys.streak,
    queryFn: () => api.get('/gamification/streak/').then(r => r.data),
    staleTime: 1000 * 60,
  })
}

export function useRecordActivity() {
  const qc = useQueryClient()
  return useMutation<Streak>({
    mutationFn: () => api.post('/gamification/streak/').then(r => r.data),
    onSuccess: (streak) => {
      qc.setQueryData(gamificationKeys.streak, streak)
      qc.invalidateQueries({ queryKey: gamificationKeys.dashboard })
    },
  })
}

export function useTasbihDhikr() {
  return useQuery<TasbihDhikr[]>({
    queryKey: gamificationKeys.dhikrList,
    queryFn: () => api.get('/gamification/tasbih/dhikr/').then(r => r.data),
    staleTime: Infinity,
  })
}

export function useTasbihSessions() {
  return useQuery<TasbihSession[]>({
    queryKey: gamificationKeys.sessions,
    queryFn: () => api.get('/gamification/tasbih/sessions/').then(r => r.data),
  })
}

export function useCreateTasbihSession() {
  const qc = useQueryClient()
  return useMutation<TasbihSession, Error, { dhikr_id: number; target?: number }>({
    mutationFn: (payload) => api.post('/gamification/tasbih/sessions/', payload).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: gamificationKeys.sessions }),
  })
}

export function useIncrementTasbih() {
  const qc = useQueryClient()
  return useMutation<TasbihIncrementResponse, Error, { sessionId: number; amount?: number }>({
    mutationFn: ({ sessionId, amount = 1 }) =>
      api.post(`/gamification/tasbih/sessions/${sessionId}/increment/`, { amount }).then(r => r.data),
    onSuccess: (data, { sessionId }) => {
      qc.setQueryData<TasbihSession[]>(gamificationKeys.sessions, (old) =>
        old?.map(s => s.id === sessionId ? { ...s, count: data.count, completed: data.completed } : s)
      )
    },
  })
}

export function useAchievements() {
  return useQuery<Achievement[]>({
    queryKey: gamificationKeys.achievements,
    queryFn: () => api.get('/gamification/achievements/').then(r => r.data),
    staleTime: Infinity,
  })
}

export function useMyAchievements() {
  return useQuery<UserAchievement[]>({
    queryKey: gamificationKeys.myAchievements,
    queryFn: () => api.get('/gamification/achievements/mine/').then(r => r.data),
  })
}

export function useGamificationDashboard() {
  return useQuery<GamificationDashboard>({
    queryKey: gamificationKeys.dashboard,
    queryFn: () => api.get('/gamification/dashboard/').then(r => r.data),
    staleTime: 1000 * 60,
  })
}
