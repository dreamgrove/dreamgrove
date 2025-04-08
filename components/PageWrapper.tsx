import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import { ReactNode } from 'react'

interface Chapter {
  value: string
  depth: number
  url: string
}

interface PageWrapperProps {
  title?: string
  toc?: Chapter[]
  children: ReactNode
  showTitle?: boolean
  isBlog?: boolean
}

export default function PageWrapper({
  title,
  toc,
  children,
  showTitle = true,
  isBlog = false,
}: PageWrapperProps) {
  return (
    <>
      <Header toc={toc} title={title} showTitle={showTitle} isBlog={isBlog} />
      <SectionContainer>
        <main className="mb-auto">{children}</main>
      </SectionContainer>
    </>
  )
}
