import { useState, useEffect } from 'react'

interface CachedCity { lat: number; lon: number; name: string; ts: number }

export function useCityName(lat: number | null, lon: number | null): string {
  const [city, setCity] = useState('')

  useEffect(() => {
    if (!lat || !lon) return

    const cached = localStorage.getItem('muslihun-city')
    if (cached) {
      try {
        const data: CachedCity = JSON.parse(cached)
        const samePlace = Math.abs(data.lat - lat) + Math.abs(data.lon - lon) < 0.1
        const fresh = Date.now() - data.ts < 1000 * 60 * 60 * 24 * 7
        if (samePlace && fresh) { setCity(data.name); return }
      } catch { /* ignore */ }
    }

    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
      .then(r => r.json())
      .then(data => {
        const name = data.address?.city || data.address?.town || data.address?.county || data.address?.state || ''
        if (name) {
          setCity(name)
          localStorage.setItem('muslihun-city', JSON.stringify({ lat, lon, name, ts: Date.now() }))
        }
      })
      .catch(() => {})
  }, [lat, lon])

  return city
}
