'use client'

import { useEffect, useState } from 'react'

export function AprilFoolsTheme({ children }: { children: React.ReactNode }) {
  const [isAprilFools, setIsAprilFools] = useState(false)

  useEffect(() => {
    const checkIfAprilFools = () => {
      const now = new Date()
      //const isApril1st = now.getMonth() === 3 && now.getDate() === 1 // Month is 0-based
      const isApril1st = true
      setIsAprilFools(isApril1st)
    }

    // Check immediately
    checkIfAprilFools()

    // Check every minute for date changes around midnight
    const interval = setInterval(checkIfAprilFools, 60000)

    return () => clearInterval(interval)
  }, [])

  return <div data-theme={isAprilFools ? 'april-fools' : undefined}>{children}</div>
}
