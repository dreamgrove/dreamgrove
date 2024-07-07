'use client'
import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import TableOfContents from '@/components/custom/TableOfContents'

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: string[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, children }: LayoutProps) {
  const { patch, slug, title, tags, toc } = content

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pb-6 pt-0 sm:pt-6">
            <div className="space-y-1 text-center">
              <div>
                <PageTitle>{title}</PageTitle>
              </div>

              <div className="xl:col-span-3 xl:border-b xl:border-gray-200 xl:pb-4 xl:pt-4 xl:dark:border-gray-700">
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Written by{' '}
                  {authorDetails.map((author, index) => (
                    <span key={author} className="text-[#1a9c82]">
                      {index > 0 && ', '}
                      {author}
                    </span>
                  ))}
                </p>
              </div>
              <dl className="space-y-10">
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    <span>Updated for patch {patch}</span>
                  </dd>
                </div>
              </dl>
            </div>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 dark:divide-gray-700 lg:grid lg:grid-cols-12 lg:gap-x-6 lg:divide-y-0">
            <aside className="hidden overflow-y-auto lg:sticky lg:top-0 lg:col-span-3 lg:block lg:h-screen lg:pr-6">
              <TableOfContents chapters={toc} />
            </aside>

            <div
              id="main"
              className="divide-y divide-gray-200 dark:divide-gray-700 lg:col-span-9 lg:pb-0"
            >
              <div
                style={{ counterReset: 'heading' }}
                className="prose ml-2 max-w-none pb-8 pt-10 text-base dark:prose-invert"
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
