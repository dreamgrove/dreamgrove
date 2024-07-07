import { ReactNode, useState } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Raids } from 'contentlayer/generated'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import { FaArrowLeft } from 'react-icons/fa'
import ContributeHeader from '@/components/custom/ContributeHeader'

interface LayoutProps {
  content: CoreContent<Raids>
  authorDetails: string[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function RaidLayout({ content, children }: LayoutProps) {
  const { title } = content

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 xl:pb-6">
            <div className="space-y-6 text-center">
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
              <Link href="/raids">
                <div className="flex items-center text-left underline md:text-xl">
                  <FaArrowLeft className="inline " />
                  <span className="ml-2">Go Back</span>
                </div>
              </Link>
              <ContributeHeader />
            </div>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:grid xl:grid-cols-12 xl:gap-x-6 xl:divide-y-0">
            <div
              id="main"
              className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-12 xl:pb-0"
            >
              <div className="prose max-w-none pb-8 pt-10 dark:prose-invert">{children}</div>
            </div>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
