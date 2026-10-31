import { ReactNode } from 'react'
import type { About } from 'contentlayer/generated'
import SectionContainer from '@/components/SectionContainer'
import PageActions from '@/components/PageActions'
import PageTitle from '@/components/PageTitle'

interface Props {
  children: ReactNode
  content: Omit<About, '_id' | '_raw' | 'body'>
}

export default function AboutLayout({ children, content }: Props) {
  const { title, filePath } = content

  return (
    <SectionContainer>
      <PageActions editPath={filePath} />
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
            className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 xl:divide-y-0 dark:divide-gray-700"
          >
            <div className="divide-y divide-gray-200 xl:col-span-3 xl:row-span-2 xl:pb-0 dark:divide-gray-700">
              <div className="prose dark:prose-invert max-w-none pt-10 pb-8">{children}</div>
            </div>
            <footer>
              <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base"></div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
