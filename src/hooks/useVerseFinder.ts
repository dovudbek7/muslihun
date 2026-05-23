import { useState, useRef, useCallback } from 'react'
import { findVerse, type VerseMatch } from '@/utils/verseFinder'

interface VerseSlim {
  id: number
  number: number
  text_arabic: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SR = new () => any

export function useVerseFinder(verses: VerseSlim[]) {
  const [transcript, setTranscript] = useState('')
  const [result, setResult] = useState<VerseMatch | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [isSupported] = useState(
    typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recRef = useRef<any>(null)

  const start = useCallback(() => {
    if (!isSupported) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SRClass = ((window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition) as SR
    const rec = new SRClass()
    rec.lang = 'ar-SA'
    rec.continuous = true
    rec.interimResults = true
    rec.maxAlternatives = 1

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      let text = ''
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript + ' '
      }
      const t = text.trim()
      setTranscript(t)
      const match = findVerse(t, verses)
      if (match) setResult(match)
    }

    rec.onend = () => {
      if (recRef.current === rec) setIsListening(false)
    }

    recRef.current = rec
    rec.start()
    setIsListening(true)
    setTranscript('')
    setResult(null)
  }, [isSupported, verses])

  const stop = useCallback(() => {
    recRef.current?.stop()
    recRef.current = null
    setIsListening(false)
  }, [])

  const reset = useCallback(() => {
    stop()
    setTranscript('')
    setResult(null)
  }, [stop])

  return { transcript, result, isListening, isSupported, start, stop, reset }
}
