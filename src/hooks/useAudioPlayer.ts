import { useEffect, useRef, useCallback } from 'react'
import { useAudioStore } from '@/stores/audioStore'

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const store = useAudioStore()

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.preload = 'metadata'
    }

    const audio = audioRef.current

    const onTimeUpdate = () => store.setProgress(audio.currentTime)
    const onLoadedMetadata = () => store.setDuration(audio.duration)
    const onEnded = () => {
      if (store.mode === 'loop') {
        audio.currentTime = 0
        audio.play()
      } else {
        store.pause()
      }
    }
    const onWaiting = () => store.setLoading(true)
    const onPlaying = () => store.setLoading(false)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('playing', onPlaying)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('playing', onPlaying)
    }
  }, [store.mode])

  useEffect(() => {
    if (!audioRef.current) return
    const audio = audioRef.current

    if (store.audioUrl && audio.src !== store.audioUrl) {
      audio.src = store.audioUrl
      audio.load()
    }

    if (store.isPlaying) {
      audio.play().catch(() => store.pause())
    } else {
      audio.pause()
    }
  }, [store.isPlaying, store.audioUrl])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = store.isMuted ? 0 : store.volume
    }
  }, [store.volume, store.isMuted])

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }, [])

  return { seek, audioRef }
}
