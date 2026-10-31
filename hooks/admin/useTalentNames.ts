import { useEffect, useState } from 'react'

let talentNamesCache: string[] | null = null

/** Every talent and choice node name. Loads the talent data on first use */
export function useTalentNames(enabled: boolean): string[] {
  const [names, setNames] = useState<string[]>(talentNamesCache ?? [])
  useEffect(() => {
    if (!enabled || talentNamesCache) return
    let active = true
    import('../../other/talents.json').then((mod) => {
      const set = new Set<string>()
      for (const spec of mod.default as any[]) {
        for (const node of [
          ...(spec.classNodes ?? []),
          ...(spec.specNodes ?? []),
          ...(spec.heroNodes ?? []),
        ]) {
          if (node.name) set.add(node.name)
          for (const e of [...(node.entries ?? []), ...(node.choices ?? [])]) {
            if (e.name) set.add(e.name)
          }
        }
      }
      talentNamesCache = [...set].sort()
      if (active) setNames(talentNamesCache)
    })
    return () => {
      active = false
    }
  }, [enabled])
  return names
}
