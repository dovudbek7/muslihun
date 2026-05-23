const KEY = 'muslihun-recitation-progress'

interface ProgressData {
  [surahId: number]: number // verseIdx
}

function load(): ProgressData {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '{}') } catch { return {} }
}

export function saveProgress(surahId: number, verseIdx: number): void {
  try {
    const data = load()
    data[surahId] = verseIdx
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch { /* ignore */ }
}

export function loadProgress(surahId: number): number | null {
  const v = load()[surahId]
  return typeof v === 'number' && v > 0 ? v : null
}

export function clearProgress(surahId: number): void {
  try {
    const data = load()
    delete data[surahId]
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch { /* ignore */ }
}
