import { isAprilFoolsServer } from '../app/utils/serverDateUtils'

export function AprilFoolsTheme({ children }: { children: React.ReactNode }) {
  const aprilFools = isAprilFoolsServer()

  return <div data-theme={aprilFools ? 'april-fools' : undefined}>{children}</div>
}
