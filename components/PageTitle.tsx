import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
}

export default function PageTitle({ children, className = '' }: Props) {
  return (
    <h1
      className={`font-familiar-pro text-3xl font-bold leading-9 tracking-tight text-[#f3f3f3] sm:text-4xl sm:leading-10 ${className}`}
    >
      {children}
    </h1>
  )
}
