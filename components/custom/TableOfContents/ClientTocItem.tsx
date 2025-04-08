'use client'

import { useState, useEffect } from 'react'

interface Chapter {
  value: string
  depth: number
  url: string
}

type ClientTocItemProps = {
  item: Chapter
  inSidebar?: boolean
  toggleNav?: () => void
  initialActive?: boolean
}

function getIdFromUrl(url: string): string {
  return url.replace(/-\d+$/, '') // Remove '#' and the trailing '-{number}'
}

export default function ClientTocItem({
  item,
  inSidebar = false,
  toggleNav = () => {},
  initialActive = false,
}: ClientTocItemProps) {
  const [isActive, setIsActive] = useState(initialActive)
  const targetUrl = getIdFromUrl(item.url)

  useEffect(() => {
    if (inSidebar) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsActive(true)
          } else {
            setIsActive(false)
          }
        })
      },
      {
        rootMargin: '-9% 0px -89% 0px',
      }
    )

    const elementId = `container-${getIdFromUrl(item.url.slice(1))}`
    const element = document.getElementById(elementId)
    if (element) {
      observer.observe(element)
    }

    return () => {
      observer.disconnect()
    }
  }, [item.url, inSidebar])

  if (inSidebar && toggleNav) {
    return (
      <li
        className={`text-md my-2 font-bold text-gray-800 dark:text-gray-400`}
        style={{
          marginLeft: `${(item.depth - 1) * 25}px`,
          marginTop: item.depth === 1 ? '0' : '5px',
        }}
      >
        <a
          onClick={(e) => {
            e.preventDefault()
            const element = document.querySelector(targetUrl)
            if (element) {
              // First close the sidebar
              toggleNav()
              // Then scroll to the element after a small delay
              setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth' })
              }, 300)
            }
          }}
          href={targetUrl}
        >
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
        marginTop: item.depth === 1 ? '0' : '5px',
      }}
    >
      <a
        onClick={(e) => {
          e.preventDefault()
          const element = document.querySelector(targetUrl)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }}
        href={targetUrl}
      >
        {item.value}
      </a>
    </li>
  )
}
