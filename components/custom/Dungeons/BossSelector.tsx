'use client'
import { useState } from 'react'
import { Children, isValidElement } from 'react'
import type { ReactElement } from 'react'

interface ComponentWithDisplayName {
  displayName?: string
}

interface BossSelectorProps {
  children: React.ReactNode
}

export default function BossSelector({ children }: BossSelectorProps) {
  const [selectedBoss, setSelectedBoss] = useState<string | null>(null)

  const bossCards = Children.toArray(children).filter(
    (child) => isValidElement(child) && child.type?.toString().includes('BossCard')
  )

  const bossList = bossCards.map((card: ReactElement) => ({
    title: card.props.title as string,
    id: (card.props.id as string) || (card.props.title as string),
  }))

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {bossList.map((boss) => (
          <button
            key={boss.id}
            onClick={() => setSelectedBoss(boss.id === selectedBoss ? null : boss.id)}
            className={`rounded-md px-4 py-2 text-sm transition-colors ${
              selectedBoss === boss.id
                ? 'bg-main text-white'
                : 'bg-gray-700/50 text-gray-200 hover:bg-gray-600/50'
            }`}
          >
            {boss.title}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {Children.map(children, (child) => {
          if (!isValidElement(child) || !child.type?.toString().includes('BossCard')) return null
          const bossId = child.props.id || child.props.title
          return selectedBoss === null || selectedBoss === bossId ? child : null
        })}
      </div>
    </div>
  )
}
