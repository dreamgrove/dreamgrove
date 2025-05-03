import React from 'react'
import Cast, { CastInfo } from './Cast'

interface SpellCastsRowProps {
  spellName: string
  casts: (CastInfo & { id?: string })[]
  wowheadComponent: React.ReactNode
  onCastClick?: (castId: string) => void
  onCastDragStart?: (castId: string, event: React.MouseEvent) => void
  onCastDelete?: (castId: string) => void
  className?: string
}

export default function SpellCastsRow({
  spellName,
  casts,
  wowheadComponent,
  onCastClick,
  onCastDragStart,
  onCastDelete,
  className,
}: SpellCastsRowProps) {
  return (
    <div className={`relative w-full ${className || ''}`}>
      {casts.map((cast, index) => (
        <div
          key={cast.id || `cast-${index}`}
          className="absolute"
          style={{
            left: `${(cast.start_s / cast.total_length_s) * cast.timeline_total_length_px}px`,
            top: 0,
          }}
          onClick={() => cast.id && onCastClick && onCastClick(cast.id)}
          onMouseDown={(e) => cast.id && onCastDragStart && onCastDragStart(cast.id, e)}
        >
          <Cast
            castInfo={cast}
            Wowhead={wowheadComponent}
            onDelete={cast.id && onCastDelete ? () => onCastDelete(cast.id!) : undefined}
          />
        </div>
      ))}
    </div>
  )
}
