import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Changelog } from 'contentlayer/generated'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

import fs from 'fs'
import path from 'path'
import Dialog from '@/components/custom/Dialog/Dialog'

interface LayoutProps {
  content: CoreContent<Changelog>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export default function ChangelogLayout({ content, next, prev, children }: LayoutProps) {
  const { slug, title } = content
  const filePath = path.join(process.cwd(), 'news', 'druid_latest.txt')

  // Get file stats
  let creationDate = ''
  try {
    const stats = fs.statSync(filePath)
    const creationDateObj = new Date(stats.birthtime)
    creationDate = creationDateObj.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  } catch (error) {
    console.error('Error reading file stats:', error)
  }

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div>
          <header>
            <div className="space-y-1 border-b border-gray-200 pb-10 text-center dark:border-gray-700">
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div
            id="main"
            className="divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:divide-y-0"
          >
            <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:pb-0">
              <div>
                <Dialog type="warning">
                  <span>
                    <span className="font-bold text-gray-800/80">Last Update: {creationDate}.</span>{' '}
                    This section is still a work in progress. Changes are not guaranteed to be
                    complete or accurate.
                  </span>
                </Dialog>
                <div className="mx-1 mb-2">
                  The changelog is generated based on the simc druid spelldumps. Latest dump can be
                  found{' '}
                  <a
                    href="https://raw.githubusercontent.com/dreamgrove/dreamgrove/master/news/druid_latest.txt"
                    className="text-main underline"
                  >
                    here
                  </a>
                </div>
              </div>
              <div className="prose max-w-none pb-8 pt-10 dark:prose-invert">{children}</div>
            </div>
            <footer></footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
