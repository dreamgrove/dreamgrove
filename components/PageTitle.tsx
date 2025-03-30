'use client'
import { ReactNode, useEffect, useState } from 'react'

interface Props {
  children: ReactNode
  className?: string
}

export default function PageTitle({ children, className = '' }: Props) {
  const [x, sX] = useState(false)

  return (
    <h1
      className={`font-familiar-pro text-3xl font-bold leading-9 tracking-tight text-[#f3f3f3] sm:text-4xl sm:leading-10 md:text-4xl md:leading-14 ${className}`}
    >
      {children}
    </h1>
  )
}
