import { useEffect, useCallback } from 'react'
import { useAudioStore } from '@/stores/audioStore'

// Singleton — one audio element for the entire app lifetime
const audio = new Audio()
audio.preload = 'metadata'

export function useAudioPlayer() {
  const store = useAudioStore()

  useEffect(() => {
    const onTimeUpdate = () => store.setProgress(audio.currentTime)
    const onLoadedMetadata = () => store.setDuration(audio.duration)
    const onEnded = () => {
      if (store.mode === 'loop') {
        audio.currentTime = 0
        audio.play()
      } else {
        store.nextVerse()
      }
    }
    const onWaiting = () => store.setLoading(true)
    const onPlaying = () => store.setLoading(false)
    const onError = () => store.setLoading(false)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('error', onError)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('playing', onPlaying)
      audio.removeEventListener('error', onError)
    }
  }, [store.mode])

  useEffect(() => {
    if (store.audioUrl && audio.src !== store.audioUrl) {
      audio.src = store.audioUrl
    }

    if (store.isPlaying) {
      audio.play().catch(() => store.pause())
    } else {
      audio.pause()
    }
  }, [store.isPlaying, store.audioUrl])

  useEffect(() => {
    audio.volume = store.isMuted ? 0 : store.volume
  }, [store.volume, store.isMuted])

  const seek = useCallback((time: number) => {
    audio.currentTime = time
  }, [])

  return { seek }
}
