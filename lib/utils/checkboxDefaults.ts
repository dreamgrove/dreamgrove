export interface CheckboxItem {
  checked: boolean
  radioGroup: string | null
}

const attr = (tag: string, name: string) => {
  const match = tag.match(new RegExp(`\\b${name}=(?:"([^"]*)"|'([^']*)'|\\{([^}]*)\\})`))
  if (!match) return ''
  return (match[1] ?? match[2] ?? match[3] ?? '').trim().replace(/^["']|["']$/g, '')
}

/**
 * Reads every <Checkbox> in a guide's MDX source and returns the state the checkboxes
 * register on mount (see CheckboxToggler). Seeding CheckboxProvider with it lets the
 * server render default-selected conditional content visible, instead of rendering it
 * hidden and revealing it only after hydration.
 */
export function getCheckboxDefaults(raw: string): Record<string, CheckboxItem> {
  const source = raw
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')

  const map: Record<string, CheckboxItem> = {}

  for (const [tag] of source.matchAll(/<Checkbox\b[^>]*>/g)) {
    // Same id fallback as <Checkbox>
    const id = attr(tag, 'id') || attr(tag, 'spellId')
    if (!id) continue

    // Same order-dependent rules as CheckboxProvider.updateCheckbox, applied in source
    // order: a later registration overwrites an earlier one, and a checked radio
    // unchecks the rest of its group.
    const checked = /\bdefaultCheck\b(?!=\{false\})/.test(tag)
    const radioGroup = attr(tag, 'radio') || null
    map[id] = { checked, radioGroup }

    if (radioGroup && checked) {
      for (const key of Object.keys(map)) {
        if (key !== id && map[key].radioGroup === radioGroup) map[key].checked = false
      }
    }
  }

  return map
}
