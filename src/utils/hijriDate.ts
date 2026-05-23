export function getHijriDate(): string {
  try {
    const formatted = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date())
    return formatted.replace(' AH', '').replace(/\s+/g, ' ').trim()
  } catch {
    return ''
  }
}
