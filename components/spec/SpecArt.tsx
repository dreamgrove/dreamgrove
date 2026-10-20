import Image from 'next/image'

interface SpecArtProps {
  art?: string
  color: string
  /** Opacity of the spec-colour multiply tint */
  tint: number
  /** Opacity of the flat dark scrim on top */
  scrim: number
  position?: string
  priority?: boolean
  className?: string
}

export default function SpecArt({
  art,
  color,
  tint,
  scrim,
  position,
  priority,
  className = '',
}: SpecArtProps) {
  return (
    <>
      <div
        className={`absolute inset-0 ${className}`}
        // Until splash art is added, fall back to a muted spec-colour panel
        style={art ? undefined : { background: color, opacity: 0.55 }}
      >
        {art && (
          <Image
            src={art}
            alt=""
            fill
            priority={priority}
            sizes="100vw"
            className="object-cover"
            style={position ? { objectPosition: position } : undefined}
          />
        )}
      </div>

      <div
        data-spec-shade
        className="pointer-events-none absolute -inset-1 mix-blend-multiply transition-opacity duration-[400ms]"
        style={{ background: color, opacity: tint }}
      />
      <div
        data-spec-shade
        className="pointer-events-none absolute -inset-1"
        style={{ background: `rgba(11,9,6,${scrim})` }}
      />
    </>
  )
}
