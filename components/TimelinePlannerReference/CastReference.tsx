import React from 'react'

interface CastProps {
  cooldown: number
  duration: number
  channeled: boolean
  children?: React.ReactNode
}

export default function Cast({ cooldown, duration, channeled, children }: CastProps) {
  const remainderWidth = cooldown - duration

  return (
    <div
      className="relative flex h-full rounded-md border border-white/20"
      style={{
        width: `${cooldown}px`, // Full width based on cooldown
      }}
    >
      {/* Duration section */}
      <div
        className="rounded-l-md"
        style={{
          width: `${duration}px`,
          height: '100%',
          backgroundColor: channeled
            ? 'rgba(255, 152, 0, 0.5)' // More opaque orange for channeled
            : 'rgba(255, 152, 0, 0.2)', // Semi-transparent orange for non-channeled
        }}
      />
      {/* Remainder section */}
      <div
        className="relative flex items-center"
        style={{
          width: `${remainderWidth}px`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
