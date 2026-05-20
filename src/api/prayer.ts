import { useQuery } from '@tanstack/react-query'
import { api } from '@/config/api'
import type { PrayerTimesData } from '@/types/prayer'

export const prayerKeys = {
  times: (lat: number, lon: number, method: number) =>
    ['prayer', 'times', lat.toFixed(2), lon.toFixed(2), method] as const,
}

export function usePrayerTimes(
  latitude: number | null,
  longitude: number | null,
  method = 3
) {
  return useQuery<PrayerTimesData>({
    queryKey: prayerKeys.times(latitude ?? 0, longitude ?? 0, method),
    queryFn: () =>
      api.get('/prayer/times/', {
        params: { latitude, longitude, method },
      }).then(r => r.data),
    enabled: latitude !== null && longitude !== null,
    staleTime: 1000 * 60 * 60 * 6,
    gcTime: 1000 * 60 * 60 * 12,
  })
}
