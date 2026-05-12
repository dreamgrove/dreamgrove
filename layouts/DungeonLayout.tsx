'use client'
import { ReactNode } from 'react'
import { CoreContent } from '@/lib/utils/contentlayer'
import type { Dungeons, Raids } from 'contentlayer/generated'
import SectionContainer from '@/components/SectionContainer'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import { FaArrowLeft } from 'react-icons/fa'
import ContributeHeader from '@/components/custom/ContributeHeader'
import RoleSelector from '@/components/custom/Dungeons/RoleSelector'
import Link from 'next/link'
import Image from 'next/image'
import CheckboxProvider from '@/components/custom/CheckboxProvider'

interface LayoutProps {
  content: CoreContent<Dungeons | Raids>
  authorDetails: string[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
  showTitle?: boolean
}

export default function DungeonLayout({ content, children, showTitle = true }: LayoutProps) {
  const { title, headerImage, path } = content
  const parentPath = `/${path.split('/')[0]}`

  return (
    <SectionContainer>
      <ScrollTopAndComment />

      <article>
        <div className="toChange">
          <header className="pt-0 pb-6">
            <div className="space-y-6 text-center">
              {headerImage && (
                <div className="relative block overflow-hidden rounded-lg">
                  <div className="relative h-48 w-full">
                    <Image
                      alt={title}
                      src={`/static/images/${headerImage}`}
                      layout="fill"
                      sizes="100vw"
                      style={{
                        objectFit: 'cover',
                      }}
                    />
                    <div className="font-thiccboi absolute inset-0 flex items-center justify-center bg-black/50 p-2 text-[50px] text-white">
                      {title}
                    </div>
                  </div>
                </div>
              )}
              <ContributeHeader />
              <Link href={parentPath} className="cursor-pointer">
                <div className="flex items-center pt-0 text-left underline md:text-xl">
                  <FaArrowLeft className="inline" />
                  <span className="ml-2">Go Back</span>
                </div>
              </Link>
            </div>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 xl:grid xl:gap-x-6 xl:divide-y-0 dark:divide-gray-700">
            <CheckboxProvider>
              <div id="main" className="xl:col-span-12 xl:pb-0">
                <RoleSelector />
                <div className="prose dark:prose-invert max-w-none pt-0 pb-8">{children}</div>
              </div>
            </CheckboxProvider>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
