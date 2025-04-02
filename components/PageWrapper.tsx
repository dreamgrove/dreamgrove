import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import { ReactNode } from 'react'

interface PageWrapperProps {
  title?: string
  children: ReactNode
  showTitle?: boolean
  isBlog?: boolean
}

export default function PageWrapper({
  title,
  children,
  showTitle = true,
  isBlog = false,
}: PageWrapperProps) {
  return (
    <>
      <Header title={title} showTitle={showTitle} isBlog={isBlog} />
      <SectionContainer>
        <main className="mb-auto">{children}</main>
      </SectionContainer>
    </>
  )
}
