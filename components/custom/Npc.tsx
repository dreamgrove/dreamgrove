export default function Npc({ id, name }) {
  return (
    <>
      <a href={`https://www.wowhead.com/npc=${id}`} className="inline">
        {name || ''}
      </a>{' '}
    </>
  )
}
