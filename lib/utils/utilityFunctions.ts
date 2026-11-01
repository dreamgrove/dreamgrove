// Helper function to format time as minutes:seconds
export function formatTime(seconds: number): string {
  if (seconds < 0) return '0:00'

  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function round(value: number, precision: number) {
  return Math.round(value * precision) / precision
}
