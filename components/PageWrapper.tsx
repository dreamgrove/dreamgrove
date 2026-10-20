import Header, { type HeaderCrumb } from '@/components/Header'
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
  crumb?: HeaderCrumb
  variant?: 'default' | 'redesign'
}

export default function PageWrapper({
  title,
  toc,
  children,
  showTitle = true,
  isBlog = false,
  crumb,
  variant = 'default',
}: PageWrapperProps) {
  if (variant === 'redesign') {
    return (
      <div className="dark dg-page">
        <Header
          toc={toc}
          title={title}
          showTitle={showTitle}
          isBlog={isBlog}
          crumb={crumb}
          variant="redesign"
        />
        {children}
      </div>
    )
  }

  return (
    <>
      <Header toc={toc} title={title} showTitle={showTitle} isBlog={isBlog} crumb={crumb} />
      <SectionContainer>
        <div className="mb-auto">{children}</div>
      </SectionContainer>
    </>
  )
}
