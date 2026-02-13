const ca = /[&<>'"]/g
const esca: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
}

export const escape = (es: string): string => es.replace(ca, (m) => esca[m])
