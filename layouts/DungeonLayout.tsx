'use client'
import { ReactNode } from 'react'
import { CoreContent } from '@/lib/utils/contentlayer'
import type { Dungeons, Raids } from 'contentlayer/generated'
import SectionContainer from '@/components/SectionContainer'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import { FaArrowLeft } from 'react-icons/fa'
import ContributeHeader from '@/components/custom/ContributeHeader'
import RoleSelector from '@/components/custom/Dungeons/RoleSelector'
import { useRouter } from 'next/navigation'
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
  const { title, headerImage } = content
  const router = useRouter()

  return (
    <SectionContainer>
      <ScrollTopAndComment />

      <article>
        <div className="toChange xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-0 xl:pb-6">
            <div className="space-y-6 text-center">
              {headerImage && (
                <div className="relative block overflow-hidden rounded-lg">
                  <div className="relative h-48 w-full">
                    <Image
                      alt={title}
                      src={`/static/images/${headerImage}`}
                      quality={100}
                      layout="fill"
                      sizes="100vw"
                      style={{
                        objectFit: 'cover',
                      }}
                    />
                    <div className="bg-opacity-50 font-thiccboi absolute inset-0 flex items-center justify-center bg-black p-2 text-[50px] text-white">
                      {title}
                    </div>
                  </div>
                </div>
              )}
              <ContributeHeader />
              <div className="cursor-pointer" onClick={() => router.back()}>
                <div className="flex items-center pt-0 text-left underline md:text-xl">
                  <FaArrowLeft className="inline" />
                  <span className="ml-2">Go Back</span>
                </div>
              </div>
            </div>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 xl:grid xl:gap-x-6 xl:divide-y-0 dark:divide-gray-700">
            <CheckboxProvider>
              <div
                id="main"
                className="divide-y divide-gray-200 xl:col-span-12 xl:pb-0 dark:divide-gray-700"
              >
                <RoleSelector />
                <div className="prose dark:prose-invert max-w-none pt-10 pb-8">{children}</div>
              </div>
            </CheckboxProvider>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
