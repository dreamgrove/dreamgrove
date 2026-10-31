'use client'

import Icon from '@/components/Icon'
import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import Link from './Link'
import headerNavLinks from '@/data/headerNavLinks'
import TableOfContents from './custom/TableOfContents/TableOfContents'
import ErrorBoundary from './custom/ErrorBoundary'

interface Chapter {
  value: string
  depth: number
  url: string
}

export default function MobileNavPanel({
  navShow,
  onToggleNav,
  toc,
}: {
  navShow: boolean
  onToggleNav: () => void
  toc?: Chapter[]
}) {
  return (
    <ErrorBoundary>
      <Transition appear show={navShow} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-30" onClose={onToggleNav}>
          <div className="fixed inset-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/25" />
            </Transition.Child>
          </div>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full opacity-0"
                enterTo="translate-x-0 opacity-95"
                leave="transition ease-in duration-200 transform"
                leaveFrom="translate-x-0 opacity-95"
                leaveTo="translate-x-full opacity-0"
              >
                <Dialog.Panel className="fixed top-0 left-0 z-10 h-full w-full bg-white opacity-95 duration-300 dark:bg-gray-950 dark:opacity-[0.98]">
                  <nav className="fixed h-full w-full overflow-scroll pt-8 text-left">
                    {headerNavLinks.map((link) => (
                      <div key={link.title} className="px-12 py-4">
                        <Link
                          href={link.href}
                          className="dark:hover:text-primary-400 hover:text-primary-500 text-2xl font-bold tracking-widest text-gray-900 dark:text-gray-100"
                          onClick={onToggleNav}
                        >
                          {link.title}
                        </Link>
                      </div>
                    ))}
                    <div className="pb-8">
                      <TableOfContents chapters={toc || []} inSidebar toggleNav={onToggleNav} />
                    </div>
                  </nav>

                  <div className="flex justify-end pt-1 pr-2">
                    <button
                      className="z-50 mt-11 mr-8 h-8 w-8"
                      aria-label="Toggle Menu"
                      onClick={onToggleNav}
                    >
                      <Icon
                        name="closeBold"
                        className="dark:hover:text-primary-400 hover:text-primary-500 h-full w-full text-gray-900 dark:text-gray-100"
                      />
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </ErrorBoundary>
  )
}
