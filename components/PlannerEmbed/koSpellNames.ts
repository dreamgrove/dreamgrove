// Official Korean names for the spells in other/timelineSpells.json, used by the
// planner embed on Korean pages (the passed name wins over the fetched tooltip
// name in Wowhead.tsx, so this map is the only lever). Sourced from the Korean
// keys of spellData.json; 740 and 33891 have none there and come from Wowhead's
// Korean tooltip API (nether.wowhead.com/tooltip/spell/<id>?locale=1).
// Add an entry here when a spell is added to timelineSpells.json.
export const koSpellNames: Record<number, string> = {
  205636: '자연의 군대',
  1239669: '일월식',
  194223: '천체의 정렬',
  202770: '엘룬의 분노',
  391528: '영혼 소집',
  197721: '번성',
  102693: '숲 수호자',
  740: '평온',
  33891: '화신: 생명의 나무',
  392356: '삼림 재생',
  106951: '광폭화',
  5217: '호랑이의 분노',
  274837: '야성의 광기',
}
