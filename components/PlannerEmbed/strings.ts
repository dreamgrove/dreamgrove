import type { PageLocale } from '@/lib/pageLocale'

// UI strings of the guide planner embed. Counted messages are whole-message
// functions so each language can place the number and plural itself.
const strings = {
  en: {
    openInPlanner: 'Open in planner →',
    // Written as \u2014 to keep a literal em dash out of the source; renders the same text as before
    invalidCode: 'Invalid planner code \u2014 could not display this timeline.',
    noCasts: 'This loadout has no casts.',
    interrupted: 'interrupted',
    skippedSpells: (count: number) => `${count} unknown spell${count > 1 ? 's' : ''} omitted`,
  },
  ko: {
    openInPlanner: '플래너에서 열기 →',
    invalidCode: '플래너 코드가 올바르지 않아 타임라인을 표시할 수 없습니다.',
    noCasts: '이 구성에는 시전 기록이 없습니다.',
    interrupted: '끊김',
    skippedSpells: (count: number) => `알 수 없는 주문 ${count}개 생략됨`,
  },
}

export type PlannerEmbedStrings = (typeof strings)['en']

export function plannerEmbedStrings(locale?: PageLocale): PlannerEmbedStrings {
  return strings[locale === 'ko' ? 'ko' : 'en']
}
