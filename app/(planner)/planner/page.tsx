import TimelinePlannerServer from '@/components/TimelinePlanner/TimelinePlannerServer'
import { TourProvider } from '@/components/TourProvider'

export const metadata = {
  title: 'Timeline Planner',
  description:
    'Interactive timeline planner for World of Warcraft Druids — plan your cooldowns and spell casts against raid boss timelines.',
}

export default function PlannerPage() {
  return (
    <div className="h-full overflow-x-hidden">
      <TourProvider>
        <TimelinePlannerServer />
      </TourProvider>
    </div>
  )
}
