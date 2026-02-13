const ca = /[&<>'"]/g
const esca = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
}

export const escape = (es) => es.replace(ca, (m) => esca[m])
