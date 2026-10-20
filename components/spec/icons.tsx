const stroke = {
  stroke: 'currentColor',
  fill: 'none',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export const ArrowLeft = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
    <path d="M19 12H5M11 6l-6 6 6 6" strokeWidth="2.2" {...stroke} />
  </svg>
)

export const ArrowRight = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="2.2" {...stroke} />
  </svg>
)

export const ChevronDown = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden className={className}>
    <path d="M6 9l6 6 6-6" strokeWidth="2" {...stroke} />
  </svg>
)
