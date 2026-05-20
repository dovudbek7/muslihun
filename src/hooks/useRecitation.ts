import { useRef, useState, useCallback, useEffect } from 'react'
import { useRecitationStore } from '@/stores/recitationStore'

interface ISpeechRecognition {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onresult: ((e: { resultIndex: number; results: { isFinal: boolean; [k: number]: { transcript: string } }[] }) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
}

export function useRecitation() {
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recRef = useRef<ISpeechRecognition | null>(null)
  const { sessionStatus, processWord } = useRecitationStore()

  const isSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  const stop = useCallback(() => {
    recRef.current?.stop()
    recRef.current = null
    setIsListening(false)
  }, [])

  const start = useCallback(() => {
    if (!isSupported) {
      setError('Brauzeringiz ovozni tanimaydi. Chrome tavsiya etiladi.')
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = ((window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition) as new () => ISpeechRecognition
    const rec = new SR()
    rec.lang = 'ar-SA'
    rec.continuous = true
    rec.interimResults = false
    rec.maxAlternatives = 1

    rec.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          const transcript = e.results[i][0].transcript.trim()
          transcript.split(/\s+/).filter(Boolean).forEach(w => processWord(w))
        }
      }
    }

    rec.onerror = (e) => {
      if (e.error === 'no-speech') return
      setError(`Mikrofon xatosi: ${e.error}`)
      setIsListening(false)
    }

    rec.onend = () => {
      if (useRecitationStore.getState().sessionStatus === 'listening') {
        setTimeout(() => { try { rec.start() } catch { /* already started */ } }, 150)
      } else {
        setIsListening(false)
      }
    }

    recRef.current = rec
    rec.start()
    setIsListening(true)
    setError(null)
  }, [isSupported, processWord])

  useEffect(() => {
    if (sessionStatus === 'paused' || sessionStatus === 'finished' || sessionStatus === 'idle') {
      recRef.current?.stop()
      recRef.current = null
      setIsListening(false)
    }
  }, [sessionStatus])

  useEffect(() => () => { recRef.current?.stop() }, [])

  return { isListening, isSupported, error, start, stop }
}
