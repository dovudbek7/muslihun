import { normalizeArabic, splitWords } from './arabicNormalize'

export interface VerseMatch {
  id: number
  number: number
  score: number
  matchedWords: number
}

export function findVerse(
  transcript: string,
  verses: Array<{ id: number; number: number; text_arabic: string }>,
): VerseMatch | null {
  const inputWords = splitWords(normalizeArabic(transcript))
  if (inputWords.length < 2) return null

  let best: VerseMatch | null = null

  for (const verse of verses) {
    const verseWords = splitWords(normalizeArabic(verse.text_arabic))
    let maxConsecutive = 0

    // Sliding window: longest consecutive match starting anywhere in verse
    for (let start = 0; start <= verseWords.length - 1; start++) {
      let count = 0
      for (let i = 0; i < inputWords.length && start + i < verseWords.length; i++) {
        if (verseWords[start + i] === inputWords[i]) count++
        else break
      }
      maxConsecutive = Math.max(maxConsecutive, count)
    }

    const score = maxConsecutive / inputWords.length
    const minWords = inputWords.length >= 4 ? 3 : 2

    if (score >= 0.5 && maxConsecutive >= minWords) {
      if (!best || score > best.score || (score === best.score && maxConsecutive > best.matchedWords)) {
        best = { id: verse.id, number: verse.number, score, matchedWords: maxConsecutive }
      }
    }
  }

  return best
}
