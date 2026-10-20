import type { ReactNode } from 'react'

interface InstanceListLayoutProps {
  title: string
  empty: boolean
  children: ReactNode
}

/** Page shell shared by the /dungeons and /raids indexes. */
export default function InstanceListLayout({ title, empty, children }: InstanceListLayoutProps) {
  return (
    <section className="dg-container pt-1 pb-16 sm:pb-[72px]">
      <header className="mb-6 flex flex-col gap-3 sm:mb-10">
        <h1 className="m-0 text-[2.6rem] leading-none font-semibold sm:text-5xl">{title}</h1>
      </header>
      {empty ? <p className="m-0 text-white/40">No guides yet.</p> : children}
    </section>
  )
}
