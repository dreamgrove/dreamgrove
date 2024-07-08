/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client'
import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './Talents.module.css'
import { FaAngleDown } from 'react-icons/fa'
import { FaAngleUp } from 'react-icons/fa'

import { allBlogs, Blog } from 'contentlayer/generated'

interface Chapter {
  value: string
  depth: number
}

const TocItem = ({
  item,
  activeSlug = '',
  inSidebar = false,
  toggleNav = () => {},
  setActiveSlug = (target) => {},
}) => {
  const targetUrl = getIdFromUrl(item.url)
  const isActive = activeSlug ? targetUrl === activeSlug : false

  if (inSidebar && toggleNav) {
    return (
      <li
        className={`text-md my-2 font-bold text-gray-800 dark:text-gray-400`}
        style={{
          marginLeft: `${(item.depth - 1) * 25}px`,
          marginTop: `${item.depth === 1 ? '12px ' : '5px'}`,
        }}
      >
        <a onClick={() => toggleNav()} href={targetUrl}>
          {item.value}
        </a>
      </li>
    )
  }

  return (
    <li
      className={`my-2 text-sm ${isActive ? 'text-xl font-bold text-main' : 'text-gray-800 dark:text-gray-400'}`}
      style={{
        marginLeft: `${(item.depth - 1) * 25}px`,
        marginTop: `${item.depth === 1 ? '12px ' : '5px'}`,
      }}
    >
      <a onClick={() => setActiveSlug(targetUrl)} href={targetUrl}>
        {item.value}
      </a>
    </li>
  )
}

const Collapsible = ({ name, children }: { name: string; children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)

  const arrow = !isOpen ? <FaAngleDown /> : <FaAngleUp />

  const handleToggle = () => {
    setIsOpen((x) => !x)
  }

  return (
    <div className="mb-4">
      <div
        onClick={handleToggle}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          width: '100%',
          height: 'auto',
          borderBottom: '2px solid white',
        }}
      >
        <div className="my-2 text-2xl">{name}</div>
        <span>{arrow}</span>
      </div>
      <div className={`mt-2 ${styles.container} ${isOpen ? styles.show : styles.hide}`}>
        {children}
      </div>
    </div>
  )
}

const renderCollapsibleItems = (items: Chapter[], toggleNav) => {
  const collapsibleItems: JSX.Element[] = []
  let currentDepth1Item: Chapter | null = null

  let currentDepth2Items: Chapter[] = []

  for (let i = 0; i < items.length; i++) {
    if (items[i].depth === 1) {
      if (currentDepth1Item) {
        collapsibleItems.push(
          <Collapsible key={collapsibleItems.length} name={currentDepth1Item.value}>
            <ol className="list-none space-y-3">
              {currentDepth2Items.map((subItem, idx) => (
                <TocItem key={idx} item={subItem} inSidebar toggleNav={toggleNav} />
              ))}
            </ol>
          </Collapsible>
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
      <Collapsible key={collapsibleItems.length} name={currentDepth1Item.value}>
        <ol className="list-none space-y-3">
          {currentDepth2Items.map((subItem, subIndex) => (
            <TocItem key={subIndex} item={subItem} inSidebar toggleNav={toggleNav} />
          ))}
        </ol>
      </Collapsible>
    )
  }

  return collapsibleItems
}

export default function TableOfContents({ chapters, inSidebar = false, toggleNav = () => {} }) {
  const [activeSlug, setActiveSlug] = useState(getIdFromUrl(chapters[0].url))
  const [scrollingDir, setScrollingDir] = useState(1)

  const handleScroll = (lastScroll) => {
    setScrollingDir(window.scrollY > lastScroll ? 0 : 1)
  }

  const clickSlug = (slug) => {
    setScrollingDir(1)
  }

  useEffect(() => {
    if (inSidebar) return
    if (typeof window !== 'undefined') {
      const lastScrollY = window.scrollY
      window.addEventListener('scroll', () => handleScroll(lastScrollY))
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const sortedEntries = scrollingDir === 1 ? entries.reverse() : entries

        sortedEntries.forEach((entry) => {
          if (entry?.isIntersecting) {
            setActiveSlug(`#${entry.target.id}`)
          }
        })
      },
      {
        rootMargin: '15% 0px -25% 0px', // Adjusting to handle multiple h1s in view
      }
    )

    chapters.forEach((chapter) => {
      if (chapter.depth === 1) {
        const element = document.getElementById(getIdFromUrl(chapter.url.slice(1)))
        if (element) {
          observer.observe(element)
        }
      }
    })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [chapters, scrollingDir])

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
    <nav className="flex min-h-svh self-start pt-[0.6rem]" aria-label="Table of Contents">
      <ol className="list-none ">
        {chapters.map((item, index) => {
          if (item.depth < 3) {
            return (
              <TocItem key={index} item={item} activeSlug={activeSlug} setActiveSlug={clickSlug} />
            )
          }
        })}
      </ol>
    </nav>
  )
}

function getIdFromUrl(url) {
  return url.replace(/-\d+$/, '') // Remove '#' and the trailing '-{number}'
}
