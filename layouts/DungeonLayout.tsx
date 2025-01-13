/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client'
import { ReactNode, useState } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Dungeons } from 'contentlayer/generated'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import { FaArrowLeft } from 'react-icons/fa'
import ContributeHeader from '@/components/custom/ContributeHeader'
import RoleSelector from '@/components/custom/Dungeons/RoleSelector'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface LayoutProps {
  content: CoreContent<Dungeons>
  authorDetails: string[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function DungeonLayout({ content, authorDetails, children }: LayoutProps) {
  const { path, title, headerImage } = content
  const basePath = path.split('/')[0]
  const router = useRouter()

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 xl:pb-6">
            <div className="space-y-6 text-center">
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
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 p-2 font-thiccboi text-[50px] text-white">
                    {title}
                  </div>
                </div>
              </div>
              <ContributeHeader />
              <div className="cursor-pointer" onClick={() => router.back()}>
                <div className="flex items-center pt-0 text-left underline md:text-xl">
                  <FaArrowLeft className="inline " />
                  <span className="ml-2">Go Back</span>
                </div>
              </div>
            </div>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:grid xl:grid-cols-12 xl:gap-x-6 xl:divide-y-0">
            <div
              id="main"
              className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-12 xl:pb-0"
            >
              <RoleSelector />
              <div className="prose max-w-none pb-8 pt-10 dark:prose-invert">{children}</div>
            </div>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
