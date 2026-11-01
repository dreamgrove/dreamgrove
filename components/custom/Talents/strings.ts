import type { PageLocale } from '@/lib/pageLocale'

// UI strings of the talent tree widget. Korean uses the in-game talent UI terms.
const strings = {
  en: {
    full: 'Full',
    class: 'Class',
    spec: 'Spec',
    hero: 'Hero',
    classTree: 'Class Tree',
    specTree: 'Specialization Tree',
    heroTree: 'Hero Tree',
    noNodes: 'No nodes available for this tree.',
    noHeroNodes: 'No hero nodes available for this class/spec.',
    noHeroSelection: 'No fully selected hero trees',
    noHeroSelectionDetail: 'All talents in a hero tree must be selected to display it',
    copy: 'Copy Talent String',
    copied: 'Copied!',
    copyFailed: 'Failed to copy',
    copyFailedDetail:
      'Failed to copy talent string to clipboard. Please try again or copy manually.',
    talentTree: 'Talent Tree',
    dropdownLabel: (name: string) => `${name} dropdown`,
    loadError: 'Error Loading Talent Tree',
  },
  ko: {
    full: '전체',
    class: '직업',
    spec: '전문화',
    hero: '영웅',
    classTree: '직업 특성',
    specTree: '전문화 특성',
    heroTree: '영웅 특성',
    noNodes: '이 트리에 표시할 특성이 없습니다.',
    noHeroNodes: '이 전문화에는 영웅 특성이 없습니다.',
    noHeroSelection: '모두 선택된 영웅 특성 트리가 없습니다',
    noHeroSelectionDetail: '영웅 특성 트리는 모든 특성을 선택해야 표시됩니다',
    copy: '특성 코드 복사하기',
    copied: '복사 성공!',
    copyFailed: '복사 실패',
    copyFailedDetail:
      '특성 코드를 클립보드에 복사하지 못했습니다. 다시 시도하거나 직접 복사해 주세요.',
    talentTree: '특성 트리',
    dropdownLabel: (name: string) => `${name} 펼치기`,
    loadError: '특성 트리를 불러오지 못했습니다',
  },
}

export type TalentStrings = (typeof strings)['en']

export function talentStrings(locale?: PageLocale): TalentStrings {
  return strings[locale === 'ko' ? 'ko' : 'en']
}
