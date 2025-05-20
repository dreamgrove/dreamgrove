import TimelinePlannerServer from '@/components/TimelinePlanner/TimelinePlannerServer'

export const metadata = {
  title: 'Timeline Planner - Dreamgrove',
  description: 'Interactive timeline planner for optimizing spell casts',
}

export default function PlannerPage() {
  return (
    <div className="container mx-auto w-[90%] py-8">
      <h1 className="mb-6 text-3xl font-bold">Timeline Planner</h1>
      <TimelinePlannerServer />
    </div>
  )
}
