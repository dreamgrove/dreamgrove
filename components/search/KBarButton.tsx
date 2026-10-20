'use client'

import { openSearch } from './KBarSearchProvider'

export const KBarButton = ({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button {...rest} onClick={openSearch}>
      {children}
    </button>
  )
}
