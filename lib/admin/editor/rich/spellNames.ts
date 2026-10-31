import { StateEffect } from '@codemirror/state'
import { ViewPlugin } from '@codemirror/view'
import { SPELL_IDS_BY_NAME, loadSpells } from '@/lib/admin/spells'

// Spell names by id
let spellNames: Map<string, string> | undefined

export function spellName(id: string) {
  if (!spellNames) {
    spellNames = new Map()
    for (const [name, i] of Object.entries(SPELL_IDS_BY_NAME)) {
      if (!/[^\u0000-ɏ]/.test(name) && !spellNames.has(String(i))) spellNames.set(String(i), name)
    }
  }
  return spellNames.get(id)
}

/** Redraws once the full spell list has arrived */
export const spellsLoaded = StateEffect.define<null>()

export const spellLoader = ViewPlugin.define((view) => {
  let live = true
  loadSpells().then((list) => {
    if (!live || !list.length) return
    spellName('')
    for (const s of list) spellNames!.set(String(s.id), s.name)
    view.dispatch({ effects: spellsLoaded.of(null) })
  })
  return {
    destroy() {
      live = false
    },
  }
})

/** Timeline spell ids as steps, consecutive repeats merged like <Timeline> does */
export function timelineSteps(ids: string[]) {
  const steps: { id: string; name: string; count: number }[] = []
  for (const id of ids) {
    const last = steps[steps.length - 1]
    if (last?.id === id) last.count++
    else steps.push({ id, name: spellName(id) ?? id, count: 1 })
  }
  return steps.map(({ name, count }) => ({ name, count }))
}
