import { useState, useEffect } from 'react'

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  error: string | null
  loading: boolean
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  })

  useEffect(() => {
    const cached = localStorage.getItem('muslihun-coords')
    if (cached) {
      const { lat, lon, ts } = JSON.parse(cached)
      if (Date.now() - ts < 1000 * 60 * 60 * 24) {
        setState({ latitude: lat, longitude: lon, error: null, loading: false })
        return
      }
    }

    if (!navigator.geolocation) {
      setState(s => ({ ...s, error: 'Geolocation not supported', loading: false }))
      return
    }

    let settled = false
    const fallback = () => {
      if (!settled) {
        settled = true
        setState({ latitude: 41.3, longitude: 69.3, error: null, loading: false })
      }
    }

    const timer = setTimeout(fallback, 5000)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timer)
        if (settled) return
        settled = true
        const lat = pos.coords.latitude
        const lon = pos.coords.longitude
        localStorage.setItem('muslihun-coords', JSON.stringify({ lat, lon, ts: Date.now() }))
        setState({ latitude: lat, longitude: lon, error: null, loading: false })
      },
      () => {
        clearTimeout(timer)
        fallback()
      },
      { timeout: 8000, maximumAge: 3600000 }
    )
  }, [])

  return state
}
