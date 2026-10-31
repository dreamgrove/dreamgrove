'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

// Full-screen app pages that own the whole viewport and have no room for the footer
const HIDDEN_ON = ['/cms/edit']

export default function FooterGate({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (HIDDEN_ON.some((p) => pathname === p || pathname?.startsWith(`${p}/`))) return null
  return children
}
