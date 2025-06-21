import { ReactNode } from 'react'
import { NextStepProvider } from 'nextstepjs'
export function Providers({ children }: { children: ReactNode }) {
  return <NextStepProvider>{children}</NextStepProvider>
}
