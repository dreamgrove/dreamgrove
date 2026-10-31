import Link from 'next/link'
import type { ReactNode } from 'react'
import PageWrapper from '@/components/PageWrapper'
import { ACCENT } from '@/lib/admin/palette'
import Icon from '@/components/Icon'

/** Centered card on the regular layout, for loading, sign-in and error states */
export default function StatusShell({ children }: { children: ReactNode }) {
  return (
    <PageWrapper
      title="Content editor"
      showTitle={false}
      variant="redesign"
      crumb={{ label: 'Editor', href: '/cms', color: ACCENT }}
    >
      <section className="dg-container flex min-h-[60vh] items-center justify-center py-16">
        <div className="w-full max-w-md rounded-sm border border-[#3a3a3a] bg-[#1f1f1f] px-8 py-10 text-center text-[.95rem] text-white/60">
          {children}
        </div>
      </section>
    </PageWrapper>
  )
}

/** A titled message in a StatusShell */
export function StatusMessage({
  title,
  children,
  error,
  back,
  action,
}: {
  title: string
  children: ReactNode
  /** Styles the message as an error */
  error?: boolean
  back?: { href: string; label: string }
  action?: ReactNode
}) {
  return (
    <StatusShell>
      <h1 className="m-0 text-[1.6rem] font-semibold text-white">{title}</h1>
      <p
        className={`mt-3 mb-0 text-[.95rem] leading-relaxed ${error ? 'text-red-400' : 'text-white/60'}`}
      >
        {children}
      </p>
      {action}
      {back && (
        <Link href={back.href} className="dg-back mt-8">
          <Icon box name="back" size={16} />
          {back.label}
        </Link>
      )}
    </StatusShell>
  )
}
