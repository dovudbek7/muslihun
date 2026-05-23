import { useMemo } from 'react'
import { useGeolocation } from './useGeolocation'

const MECCA = { lat: 21.4225, lon: 39.8262 }

function toRad(d: number) { return d * (Math.PI / 180) }

export function getQiblaAngle(lat: number, lon: number): number {
  const φ1 = toRad(lat)
  const φ2 = toRad(MECCA.lat)
  const Δλ = toRad(MECCA.lon - lon)
  const y = Math.sin(Δλ) * Math.cos(φ2)
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)
  return ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360
}

function haversineKm(lat: number, lon: number): number {
  const φ1 = toRad(lat)
  const φ2 = toRad(MECCA.lat)
  const Δφ = toRad(MECCA.lat - lat)
  const Δλ = toRad(MECCA.lon - lon)
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
  return Math.round(6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

export function useQibla() {
  const { latitude, longitude, loading, error } = useGeolocation()

  const qiblaAngle = useMemo(
    () => (latitude && longitude ? getQiblaAngle(latitude, longitude) : null),
    [latitude, longitude]
  )

  const distance = useMemo(
    () => (latitude && longitude ? haversineKm(latitude, longitude) : null),
    [latitude, longitude]
  )

  return { qiblaAngle, distance, loading, error }
}
