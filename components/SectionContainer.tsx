import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return (
    <section className="xl:max-w11xl mx-auto flex w-full max-w-7xl grow flex-col px-3 sm:px-6 xl:px-3">
      {children}
    </section>
  )
}
