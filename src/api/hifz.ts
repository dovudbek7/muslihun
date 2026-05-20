import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/config/api'
import type {
  HifzSession, HifzProgress, ErrorLog,
  SurahProgressStats, ErrorStats, HifzMode, ErrorType,
} from '@/types/hifz'

export const hifzKeys = {
  sessions: ['hifz', 'sessions'] as const,
  progress: (status?: string) => ['hifz', 'progress', status] as const,
  due: ['hifz', 'due'] as const,
  weak: ['hifz', 'weak'] as const,
  errors: (type?: ErrorType) => ['hifz', 'errors', type] as const,
  errorStats: ['hifz', 'errorStats'] as const,
  surahProgress: (n: number) => ['hifz', 'surahProgress', n] as const,
}

export function useHifzSessions() {
  return useQuery<HifzSession[]>({
    queryKey: hifzKeys.sessions,
    queryFn: () => api.get('/hifz/sessions/').then(r => r.data),
  })
}

export function useStartHifzSession() {
  const qc = useQueryClient()
  return useMutation<HifzSession, Error, { surah: number; mode: HifzMode }>({
    mutationFn: (payload) => api.post('/hifz/sessions/', payload).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: hifzKeys.sessions }),
  })
}

export function useEndHifzSession() {
  const qc = useQueryClient()
  return useMutation<HifzSession, Error, { sessionId: number; verses_attempted: number; verses_correct: number }>({
    mutationFn: ({ sessionId, ...data }) =>
      api.post(`/hifz/sessions/${sessionId}/end/`, data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: hifzKeys.sessions }),
  })
}

export function useHifzProgress(status?: string) {
  return useQuery<HifzProgress[]>({
    queryKey: hifzKeys.progress(status),
    queryFn: () =>
      api.get('/hifz/progress/', { params: status ? { status } : {} }).then(r => r.data),
  })
}

export function useDueVerses() {
  return useQuery<HifzProgress[]>({
    queryKey: hifzKeys.due,
    queryFn: () => api.get('/hifz/progress/due/').then(r => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useSubmitReview() {
  const qc = useQueryClient()
  return useMutation<HifzProgress, Error, { verse_id: number; quality: number }>({
    mutationFn: (payload) => api.post('/hifz/progress/review/', payload).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: hifzKeys.due })
      qc.invalidateQueries({ queryKey: hifzKeys.progress() })
    },
  })
}

export function useErrorLogs(type?: ErrorType) {
  return useQuery<ErrorLog[]>({
    queryKey: hifzKeys.errors(type),
    queryFn: () =>
      api.get('/hifz/errors/', { params: type ? { type } : {} }).then(r => r.data),
  })
}

export function useLogError() {
  const qc = useQueryClient()
  return useMutation<ErrorLog, Error, { verse: number; session?: number; error_type: ErrorType; notes?: string }>({
    mutationFn: (payload) => api.post('/hifz/errors/', payload).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: hifzKeys.errors() })
      qc.invalidateQueries({ queryKey: hifzKeys.errorStats })
    },
  })
}

export function useErrorStats() {
  return useQuery<ErrorStats>({
    queryKey: hifzKeys.errorStats,
    queryFn: () => api.get('/hifz/errors/stats/').then(r => r.data),
  })
}

export function useSurahProgress(surahNumber: number) {
  return useQuery<SurahProgressStats>({
    queryKey: hifzKeys.surahProgress(surahNumber),
    queryFn: () => api.get(`/hifz/progress/surah/${surahNumber}/`).then(r => r.data),
    enabled: surahNumber >= 1,
  })
}
