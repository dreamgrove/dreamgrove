'use client'
import { ReactNode, useEffect } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import TableOfContents from '@/components/custom/TableOfContents'
import { FaHistory } from 'react-icons/fa'
import { usePostTitle } from '@/components/PostTitleContext'

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: string[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
  translator: string
}

export default function PostLayout({ content, authorDetails, children }: LayoutProps) {
  const { patch, slug, title, tags, toc, lastModified, changelogUrl, translator } = content
  const { setTitle } = usePostTitle()

  useEffect(() => {
    setTitle(title)
    return () => setTitle(null)
  }, [setTitle, title])

  const updateInfo = `Last updated on the ${lastModified} for patch ${patch}`
  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div>
          <header className="pb-6 pt-0 sm:pt-8 lg:pt-6">
            <div className="space-y-1 text-center">
              <div className="lg:hidden">
                <PageTitle>{title}</PageTitle>
              </div>

              <div className="xl:col-span-3 ">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:space-x-4">
                  <div>
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Written by{' '}
                      {authorDetails.map((author, index) => (
                        <span key={author} className="text-[#1a9c82]">
                          {index > 0 && ', '}
                          {author}
                        </span>
                      ))}
                    </p>
                    {translator && translator != '' && (
                      <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Translated by <span className="text-[#1a9c82]">{translator}</span>
                      </p>
                    )}
                  </div>
                  <div className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400 sm:pt-4 lg:pt-0 lg:text-right">
                    <div>
                      Patch: <span className="text-[#1a9c82]">{patch}</span>
                    </div>
                    <div>
                      Updated: <span className="text-[#1a9c82]">{lastModified}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className="h-[1px] bg-gray-600 opacity-35"></div>
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 dark:divide-gray-700 lg:grid lg:grid-cols-12 lg:gap-x-6 lg:divide-y-0">
            <aside className="hidden overflow-y-auto lg:sticky lg:top-0 lg:col-span-3 lg:mr-6 lg:block lg:h-svh">
              <TableOfContents chapters={toc} />
            </aside>

            <div
              id="main"
              className="relative divide-gray-200 dark:divide-gray-700  lg:col-span-9 lg:pb-0"
            >
              <div className="absolute right-0 top-[10px] pt-4 md:pt-6">
                <a
                  href={changelogUrl}
                  className="ml-0 font-medium text-main underline decoration-2 underline-offset-4 sm:ml-[-1.5rem]"
                >
                  <FaHistory className="mr-2 inline" />
                  <span className="inline align-top">Changelog</span>
                </a>
              </div>
              <div
                style={{ counterReset: 'heading' }}
                className="prose  max-w-none pb-8 pt-4 text-base dark:prose-invert"
              >
                {children}
              </div>
              {siteMetadata.comments && (
                <div
                  className="pb-6 pt-6 text-center text-gray-700 dark:text-gray-300"
                  id="comment"
                >
                  <Comments slug={slug} />
                </div>
              )}
            </div>

            <footer className="xl:col-span-12">
              <div className="divide-gray-200 text-sm font-medium leading-5 dark:divide-gray-700 xl:divide-y">
                {tags && tags.length > 0 && (
                  <div className="py-4 xl:py-8">
                    <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Tags
                    </h2>
                    <div className="flex flex-wrap">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
