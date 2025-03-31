export function AprilFoolsTheme({ children }: { children: React.ReactNode }) {
  const isAprilFools = true

  return <div data-theme={isAprilFools ? 'april-fools' : undefined}>{children}</div>
}
