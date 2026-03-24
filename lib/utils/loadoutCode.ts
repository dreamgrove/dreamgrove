import { Talents, SpellInfo } from '@/types/timeline'

/**
 * Compact binary encoding for loadout import/export.
 *
 * Format (all little-endian):
 *   byte 0:      version (1)
 *   byte 1:      spec index (0=balance,1=resto,2=feral,3=guardian,4=all)
 *   bytes 2-3:   talent bitmask (uint16)
 *   bytes 4-5:   event count (uint16)
 *   per event:
 *     bytes 0-3:  spellId (int32, negative for custom)
 *     bytes 4-5:  instant in centiseconds (uint16, max ~655s)
 *
 * Prefix: "DG1" + base64url(binary)
 *
 * Custom spells (negative IDs) have their SpellInfo appended as JSON after a "." separator.
 */

const SPECS = ['balance', 'resto', 'feral', 'guardian', 'all'] as const
const TALENT_ORDER = Object.values(Talents)

// --- Encode ---

interface EncodableEvent {
  spell: SpellInfo
  instant: number
}

export function encodeLoadout(
  spec: string,
  activeTalents: string[],
  events: EncodableEvent[]
): string {
  const specIdx = SPECS.indexOf(spec as (typeof SPECS)[number])
  if (specIdx === -1) throw new Error(`Unknown spec: ${spec}`)

  // Talent bitmask
  let talentMask = 0
  for (const t of activeTalents) {
    const idx = TALENT_ORDER.indexOf(t as Talents)
    if (idx >= 0) talentMask |= 1 << idx
  }

  // Separate known vs custom spells
  const customSpells = new Map<number, SpellInfo>()
  for (const e of events) {
    if (e.spell.spellId < 0) {
      customSpells.set(e.spell.spellId, e.spell)
    }
  }

  // Binary buffer
  const headerSize = 6
  const eventSize = 6
  const buf = new ArrayBuffer(headerSize + events.length * eventSize)
  const view = new DataView(buf)
  const bytes = new Uint8Array(buf)

  bytes[0] = 1 // version
  bytes[1] = specIdx
  view.setUint16(2, talentMask, true)
  view.setUint16(4, events.length, true)

  let offset = headerSize
  for (const e of events) {
    view.setInt32(offset, e.spell.spellId, true)
    view.setUint16(offset + 4, Math.round(e.instant * 100), true)
    offset += eventSize
  }

  // Base64url encode
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  let b64 = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

  // Append custom spell definitions if any
  if (customSpells.size > 0) {
    const customArr = Array.from(customSpells.values()).map((s) => ({
      i: s.spellId,
      n: s.name,
      cd: s.channel_duration,
      ed: s.effect_duration,
      c: s.cooldown,
      ch: s.charges,
      ...(s.channeled ? { cn: 1 } : {}),
      ...(s.can_interrupt === false ? { ci: 0 } : {}),
    }))
    const customJson = JSON.stringify(customArr)
    const customB64 = btoa(customJson).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    b64 += '.' + customB64
  }

  return 'DG1' + b64
}

// --- Decode ---

interface DecodedLoadout {
  spec: string
  activeTalents: string[]
  events: { spellId: number; instant: number }[]
  customSpells: SpellInfo[]
}

function b64urlToBytes(b64url: string): Uint8Array {
  // Restore standard base64
  let b64 = b64url.replace(/-/g, '+').replace(/_/g, '/')
  while (b64.length % 4 !== 0) b64 += '='
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

export function decodeLoadout(code: string): DecodedLoadout {
  if (!code.startsWith('DG1')) throw new Error('Invalid loadout code')

  const payload = code.slice(3)
  const [mainB64, customB64] = payload.split('.')

  const bytes = b64urlToBytes(mainB64)
  const view = new DataView(bytes.buffer)

  const version = bytes[0]
  if (version !== 1) throw new Error(`Unsupported version: ${version}`)

  const specIdx = bytes[1]
  if (specIdx >= SPECS.length) throw new Error('Invalid spec')
  const spec = SPECS[specIdx]

  const talentMask = view.getUint16(2, true)
  const activeTalents: string[] = []
  for (let i = 0; i < TALENT_ORDER.length; i++) {
    if (talentMask & (1 << i)) activeTalents.push(TALENT_ORDER[i])
  }

  const eventCount = view.getUint16(4, true)
  const events: { spellId: number; instant: number }[] = []
  let offset = 6
  for (let i = 0; i < eventCount; i++) {
    const spellId = view.getInt32(offset, true)
    const centiseconds = view.getUint16(offset + 4, true)
    events.push({ spellId, instant: centiseconds / 100 })
    offset += 6
  }

  // Decode custom spells if present
  const customSpells: SpellInfo[] = []
  if (customB64) {
    try {
      let b64 = customB64.replace(/-/g, '+').replace(/_/g, '/')
      while (b64.length % 4 !== 0) b64 += '='
      const json = atob(b64)
      const arr = JSON.parse(json)
      for (const s of arr) {
        customSpells.push({
          spellId: s.i,
          name: s.n,
          channel_duration: s.cd,
          effect_duration: s.ed,
          cooldown: s.c,
          charges: s.ch,
          channeled: s.cn === 1,
          can_interrupt: s.ci !== 0,
        })
      }
    } catch {
      // Ignore malformed custom spell data
    }
  }

  return { spec, activeTalents, events, customSpells }
}
