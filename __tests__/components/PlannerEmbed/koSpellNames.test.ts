import spellsData from '../../../other/timelineSpells.json'
import { koSpellNames } from '@/components/PlannerEmbed/koSpellNames'

// A timeline spell without a Korean name silently renders in English, with a www
// link, on Korean pages. Nothing in the build reports it, so this test does.
describe('koSpellNames', () => {
  test.each(spellsData.spells.map((s) => [s.spellId, s.name]))(
    'timeline spell %i (%s) has a Korean name',
    (id) => {
      expect(koSpellNames[id as number]).toMatch(/[가-힣]/)
    }
  )
})
