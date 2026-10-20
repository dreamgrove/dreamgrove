import type { PageLocale } from '@/lib/pageLocale'
import { buildWowheadUrl } from 'app/api/wowhead-data/utils'

export default function Npc({
  id,
  name,
  locale,
}: {
  id: string | number
  name?: string
  locale?: PageLocale
}) {
  return (
    <>
      <a href={buildWowheadUrl('npc', id, undefined, false, locale)} className="inline">
        {name || ''}
      </a>{' '}
    </>
  )
}
