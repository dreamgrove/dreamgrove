import TimelinePlannerServer from '@/components/TimelinePlanner/TimelinePlannerServer'

export const metadata = {
  title: 'Timeline Planner - Dreamgrove',
  description: 'Interactive timeline planner for optimizing spell casts',
}

export default function PlannerPage() {
  return (
    <div className="h-screen max-h-screen w-screen max-w-screen overflow-x-hidden">
      <TimelinePlannerServer />
    </div>
  )
}
