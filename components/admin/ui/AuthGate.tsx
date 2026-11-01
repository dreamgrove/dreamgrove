'use client'

import { signIn, useSession } from 'next-auth/react'
import type { ReactNode } from 'react'
import Icon from '@/components/Icon'
import StatusShell, { StatusMessage } from './StatusShell'

/** Renders `children` once the visitor is signed in with GitHub, else asks them to */
export default function AuthGate({ reason, children }: { reason: string; children: ReactNode }) {
  const { status } = useSession()
  if (status === 'loading') return <StatusShell>Loading…</StatusShell>
  if (status === 'unauthenticated') {
    return (
      <StatusMessage
        title="Sign in to edit"
        action={
          <button
            onClick={() => signIn('github')}
            className="mt-6 inline-flex items-center gap-2 rounded-xs bg-white px-5 py-3 text-[.95rem] font-semibold text-dg-panel-deep transition-[filter] hover:brightness-90"
          >
            <Icon box name="github" size={16} />
            Sign in with GitHub
          </button>
        }
      >
        {reason}
      </StatusMessage>
    )
  }
  return children
}
