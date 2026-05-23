import { useState, useEffect, useCallback } from 'react'

interface CompassState {
  heading: number | null
  hasGyroscope: boolean
  needsPermission: boolean
  requestPermission: () => Promise<void>
}

export function useDeviceCompass(): CompassState {
  const [heading, setHeading] = useState<number | null>(null)
  const [hasGyroscope, setHasGyroscope] = useState(false)
  const [needsPermission, setNeedsPermission] = useState(false)

  const handler = useCallback((e: DeviceOrientationEvent) => {
    const ev = e as DeviceOrientationEvent & { webkitCompassHeading?: number }
    let h: number | null = null

    if (ev.webkitCompassHeading != null) {
      h = ev.webkitCompassHeading  // iOS
    } else if (e.absolute && e.alpha != null) {
      h = (360 - e.alpha) % 360    // Android absolute
    } else if (e.alpha != null) {
      h = (360 - e.alpha) % 360    // Android fallback
    }

    if (h != null) {
      setHeading(Math.round(h))
      setHasGyroscope(true)
    }
  }, [])

  const startListening = useCallback(() => {
    window.addEventListener('deviceorientationabsolute', handler as EventListener, true)
    window.addEventListener('deviceorientation', handler as EventListener, true)
  }, [handler])

  const requestPermission = useCallback(async () => {
    const DOE = DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<'granted' | 'denied'>
    }
    if (typeof DOE.requestPermission === 'function') {
      const result = await DOE.requestPermission()
      if (result === 'granted') {
        setNeedsPermission(false)
        startListening()
      }
    } else {
      startListening()
    }
  }, [startListening])

  useEffect(() => {
    if (!('DeviceOrientationEvent' in window)) return

    const DOE = DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<string>
    }

    if (typeof DOE.requestPermission === 'function') {
      setNeedsPermission(true)  // iOS 13+ — show permission button
    } else {
      startListening()
    }

    return () => {
      window.removeEventListener('deviceorientationabsolute', handler as EventListener, true)
      window.removeEventListener('deviceorientation', handler as EventListener, true)
    }
  }, [startListening, handler])

  return { heading, hasGyroscope, needsPermission, requestPermission }
}
