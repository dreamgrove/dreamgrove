import { ReactNode } from 'react'
import styles from '../Talents/Talents.module.css'
import ClientTocItem from './ClientTocItem'
import ClientCollapsible from './ClientCollapsible'

interface Chapter {
  value: string
  depth: number
  url: string
}

function getIdFromUrl(url: string): string {
  return url.replace(/-\d+$/, '') // Remove '#' and the trailing '-{number}'
}

export default function TableOfContents({
  chapters,
  inSidebar = false,
  toggleNav = () => {},
}: {
  chapters: Chapter[]
  inSidebar?: boolean
  toggleNav?: () => void
}) {
  if (inSidebar) {
    return (
      <nav
        className="mb-8 flex items-center self-start overflow-auto px-12 pt-9"
        aria-label="Table of Contents"
      >
        <ol className="w-full list-none space-y-3">
          {renderCollapsibleItems(chapters, toggleNav)}
        </ol>
      </nav>
    )
  }

  return (
    <nav className="flex self-start" aria-label="Table of Contents">
      <ol className="list-none">
        {chapters.map((item, index) => {
          if (item.depth < 3) {
            return <ClientTocItem key={index} item={item} initialActive={index === 0} />
          }
          return null
        })}
      </ol>
    </nav>
  )
}

function renderCollapsibleItems(items: Chapter[], toggleNav: () => void) {
  const collapsibleItems: React.ReactNode[] = []
  let currentDepth1Item: Chapter | null = null
  let currentDepth2Items: Chapter[] = []

  for (let i = 0; i < items.length; i++) {
    if (items[i].depth === 1) {
      if (currentDepth1Item) {
        collapsibleItems.push(
          <ClientCollapsible key={collapsibleItems.length} name={currentDepth1Item.value}>
            <ol className="list-none space-y-3">
              {currentDepth2Items.map((subItem, idx) => (
                <ClientTocItem key={idx} item={subItem} inSidebar={true} toggleNav={toggleNav} />
              ))}
            </ol>
          </ClientCollapsible>
        )
      }
      currentDepth1Item = items[i]
      currentDepth2Items = []
    } else if (items[i].depth === 2) {
      currentDepth2Items.push(items[i])
    }
  }

  if (currentDepth1Item) {
    collapsibleItems.push(
      <ClientCollapsible key={collapsibleItems.length} name={currentDepth1Item.value}>
        <ol className="list-none space-y-3">
          {currentDepth2Items.map((subItem, subIndex) => (
            <ClientTocItem key={subIndex} item={subItem} inSidebar={true} toggleNav={toggleNav} />
          ))}
        </ol>
      </ClientCollapsible>
    )
  }

  return collapsibleItems
}
