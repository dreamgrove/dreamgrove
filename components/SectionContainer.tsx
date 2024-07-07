import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return (
    <section className="xl:max-w-8xl mx-auto flex w-full max-w-6xl flex-grow flex-col px-4 sm:px-6 xl:px-0">
      {children}
    </section>
  )
}
