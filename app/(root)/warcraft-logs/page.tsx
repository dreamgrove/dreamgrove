import WarcraftLogs from '@/components/WarcraftLogs'

export const metadata = {
  title: 'Warcraft Logs API Test',
  description: 'Testing the integration with Warcraft Logs API',
}

export default function WarcraftLogsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Warcraft Logs API Integration Test</h1>
      <p className="mb-8">
        This page demonstrates the initial connection to the Warcraft Logs API, which will later be
        integrated into the timeline planner.
      </p>

      <WarcraftLogs />
    </div>
  )
}
