'use client'

import { useKBar } from 'kbar'

export const KBarButton = ({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { query } = useKBar()
  return (
    <button {...rest} onClick={() => query.toggle()}>
      {children}
    </button>
  )
}
