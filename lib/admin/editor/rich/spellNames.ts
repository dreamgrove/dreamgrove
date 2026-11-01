import { StateEffect } from '@codemirror/state'
import { ViewPlugin } from '@codemirror/view'
import { loadSpells, spellNameById } from '@/lib/admin/spells'

/** Redraws once the full spell list has arrived */
export const spellsLoaded = StateEffect.define<null>()

export const spellLoader = ViewPlugin.define((view) => {
  let live = true
  loadSpells().then((list) => {
    if (!live || !list.length) return
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
    else steps.push({ id, name: spellNameById(id) ?? id, count: 1 })
  }
  return steps.map(({ name, count }) => ({ name, count }))
}
