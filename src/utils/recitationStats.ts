const KEY = 'muslihun-recitation-stats'

export interface RecitationSession {
  surahNumber: number
  date: string
  correctCount: number
  errorCount: number
  totalWords: number
  mode: 'single' | 'continuous'
}

export interface SurahStats {
  surahNumber: number
  sessions: number
  bestAccuracy: number
  lastDate: string
}

function load(): SurahStats[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

function save(stats: SurahStats[]): void {
  localStorage.setItem(KEY, JSON.stringify(stats))
}

export function recordSession(session: RecitationSession): void {
  if (session.totalWords === 0) return
  const stats = load()
  const accuracy = Math.round((session.correctCount / session.totalWords) * 100)
  const existing = stats.find(s => s.surahNumber === session.surahNumber)
  if (existing) {
    existing.sessions += 1
    existing.bestAccuracy = Math.max(existing.bestAccuracy, accuracy)
    existing.lastDate = session.date
  } else {
    stats.push({
      surahNumber: session.surahNumber,
      sessions: 1,
      bestAccuracy: accuracy,
      lastDate: session.date,
    })
  }
  save(stats)
}

export function getSurahStats(surahNumber: number): SurahStats | null {
  return load().find(s => s.surahNumber === surahNumber) ?? null
}

export function getAllStats(): SurahStats[] {
  return load()
}
