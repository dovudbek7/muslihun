import { useRef, useCallback } from 'react'

const isTouchDevice =
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export function useLongPress(onLongPress: () => void, onClick?: () => void) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firedRef = useRef(false)
  const hoverReadyRef = useRef(false)

  // Touch handlers (mobile)
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    firedRef.current = false
    timerRef.current = setTimeout(() => {
      firedRef.current = true
      navigator.vibrate?.(50)
      onLongPress()
    }, 3000)
  }, [onLongPress])

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!firedRef.current && !(e.target as HTMLElement).closest('button')) {
      onClick?.()
    }
  }, [onClick])

  const onTouchMove = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    firedRef.current = true
  }, [])

  // Desktop: hover 1s then click opens action sheet; plain click = highlight
  const onMouseEnter = useCallback(() => {
    hoverReadyRef.current = false
    timerRef.current = setTimeout(() => { hoverReadyRef.current = true }, 1000)
  }, [])

  const onMouseLeave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    hoverReadyRef.current = false
  }, [])

  const onMouseClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    if (hoverReadyRef.current) {
      hoverReadyRef.current = false
      onLongPress()
    } else {
      onClick?.()
    }
  }, [onLongPress, onClick])

  if (isTouchDevice) {
    return { onTouchStart, onTouchEnd, onTouchMove }
  }

  return { onMouseEnter, onMouseLeave, onClick: onMouseClick }
}
