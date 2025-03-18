import TalentTreeClient from './TalentTreeClient'

// This is the server component that passes props to the client component
export default function TalentTree({
  viewOnly = false,
  talents = '',
}: {
  viewOnly?: boolean
  talents?: string
}) {
  return <TalentTreeClient viewOnly={viewOnly} talents={talents} />
}
