'use client'

import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import { ReactNode } from 'react'

interface PageWrapperProps {
  title?: string
  children: ReactNode
}

export default function PageWrapper({ title, children }: PageWrapperProps) {
  return (
    <>
      <Header title={title} />
      <SectionContainer>
        <main className="mb-auto">{children}</main>
      </SectionContainer>
    </>
  )
}
