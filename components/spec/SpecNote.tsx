'use client'
import type { ReactNode } from 'react'
import ConditionalElement from '@/components/custom/ConditionalElement'
import { getSpec } from '@/data/specs'

export default function SpecNote({ spec, children }: { spec: string; children?: ReactNode }) {
  const info = getSpec(spec.toLowerCase())
  if (!info) return <>{children}</>

  return (
    <ConditionalElement id={info.checkboxKey}>
      <div className="dg-spec-note">
        <div className="dg-spec-note__label" style={{ color: info.color }}>
          {info.name}
        </div>
        <div className="dg-spec-note__body">{children}</div>
      </div>
    </ConditionalElement>
  )
}
