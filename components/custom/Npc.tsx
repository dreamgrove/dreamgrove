import type { PageLocale } from '@/lib/pageLocale'

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
      <a href={`https://www.wowhead.com/npc=${id}`} className="inline">
        {name || ''}
      </a>{' '}
    </>
  )
}
