const TASHKEEL = /[ؐ-ًؚ-ٰٟ]/g
const QURAN_MARKS = /[ۖ-ۜ۟-ۤۧ-۪ۨ-ۭ]/g
const TATWEEL = /ـ/g

export function stripTashkeel(text: string): string {
  return text.replace(TASHKEEL, '').replace(QURAN_MARKS, '').replace(TATWEEL, '')
}

export function normalizeArabic(text: string): string {
  // U+0670 (superscript alef) signals madd; ASR returns full alef ا instead
  return stripTashkeel(text.replace(/ٰ/g, 'ا'))
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim()
}

export function splitWords(ayah: string): string[] {
  return ayah.trim().split(/\s+/).filter(Boolean)
}

export function wordsMatch(input: string, expected: string): boolean {
  return normalizeArabic(input) === normalizeArabic(expected)
}
