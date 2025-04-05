import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import Tag from '@/components/Tag'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import TableOfContents from '@/components/custom/TableOfContents'
import { FaHistory, FaEdit } from 'react-icons/fa'
import Link from 'next/link'

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

  // Check if this is a compendium page
  const isCompendium = slug?.endsWith('/compendium')
  // Extract the spec from the slug for the edit link
  const specSlug = isCompendium ? slug.split('/')[0] : ''

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div>
          <header className="h-auto pb-12 pt-4 lg:h-[7rem] lg:py-0">
            <div className="text-center lg:h-full">
              <div className="lg:hidden">
                <PageTitle>{title}</PageTitle>
              </div>

              <div className="flex h-full flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="pt-4 lg:h-full lg:content-around lg:self-end lg:pt-0">
                  <div className="flex flex-col space-y-0">
                    <p
                      className={`${translator ? '' : 'lg:flex lg:flex-col lg:items-start'} text-lg font-medium text-gray-900 dark:text-gray-100 lg:justify-self-start`}
                    >
                      Written by:{' '}
                      {authorDetails.map((author, index) => (
                        <span key={author} className="text-[#1a9c82]">
                          {index > 0 && ', '}
                          {author}
                        </span>
                      ))}
                    </p>
                    {translator && translator !== '' && (
                      <p className="text-lg font-medium text-gray-900 dark:text-gray-100 lg:text-left">
                        Translated by: <span className="text-[#1a9c82]">{translator}</span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="pt-4 text-base font-medium leading-6 text-gray-500 dark:text-gray-400 lg:pt-0 lg:text-right">
                  <div>
                    Patch: <span className="text-[#1a9c82]">{patch}</span>
                  </div>
                  <div>
                    Updated: <span className="text-[#1a9c82]">{lastModified}</span>
                  </div>
                  <div className="hidden lg:inline">
                    <a
                      href={changelogUrl}
                      className="mt-[-2px] text-base text-main underline decoration-2 underline-offset-4"
                    >
                      <FaHistory className="mr-2 inline" />
                      <span className="inline">Changelog</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className="mb-5 h-[1px] bg-gray-600 opacity-35"></div>
          <div className="grid-rows-[auto_1fr] pb-8 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:divide-y-0 lg:divide-gray-200 lg:dark:divide-gray-700">
            <aside className="hidden overflow-y-auto lg:sticky lg:top-0 lg:col-span-3 lg:block lg:h-svh lg:pt-5">
              <TableOfContents chapters={toc} />
            </aside>

            <div id="main" className="relative pt-4 lg:col-span-9 lg:pb-0 lg:pl-6 lg:pt-5">
              <div className="absolute right-0 top-[-5px] sm:left-auto sm:right-[0px] sm:top-[-50px] lg:hidden">
                <a
                  href={changelogUrl}
                  className="ml-0 text-sm font-medium text-main underline decoration-2 underline-offset-4 sm:ml-[-1.5rem] sm:text-base"
                >
                  <FaHistory className="mr-2 inline" />
                  <span className="inline align-top">Changelog</span>
                </a>

                {isCompendium && (
                  <Link
                    href={`/blog/${specSlug}/compendium/edit`}
                    className="ml-4 text-sm font-medium text-main underline decoration-2 underline-offset-4 sm:text-base"
                  >
                    <FaEdit className="mr-2 inline" />
                    <span className="inline align-top">Edit</span>
                  </Link>
                )}
              </div>
              <div
                style={{ counterReset: 'heading' }}
                className="prose max-w-none pb-8 pt-4 text-base dark:prose-invert sm:pt-0"
              >
                {children}
              </div>
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
