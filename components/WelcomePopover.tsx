'use client'

import { Popover, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'

export default function WelcomePopover() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if the popover has been dismissed before
    const hasBeenDismissed = localStorage.getItem('welcomePopoverDismissed')
    if (!hasBeenDismissed) {
      setIsOpen(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsOpen(false)
    localStorage.setItem('welcomePopoverDismissed', 'true')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Transition
        show={isOpen}
        as={Fragment}
        enter="transition duration-200 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-150 ease-in"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Popover className="relative">
          <div className="max-w-xs rounded-lg bg-white p-6 shadow-xl md:max-w-lg dark:bg-gray-800">
            <div className="flex items-start justify-between">
              <h2 className="mb-2 text-xl font-medium text-gray-900 dark:text-white">
                Welcome Back {':3'}
              </h2>
              <button
                onClick={handleDismiss}
                className="ml-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-hidden dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <IoClose className="h-5 w-5" />
              </button>
            </div>
            <hr />
            <div className="mt-4 flex flex-col gap-3">
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Thank you very much for the appreciation you showed for the april update!!!
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                It has been incredibly fun to develop the website and watch you all react to it.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                It really became way bigger than I ever anticipated, and I saw many of the comments
                asking for the version to be permanent!
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Because of this, there is now a button at the bottom of the page that allows you to
                switch between the themes!
              </p>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-300">
                NB: The april fools theme still has some visual bugs and won't be updated in the
                future, so use it at your own discretion!
              </p>
              <p className="self-end text-sm font-bold text-gray-500 dark:text-gray-300">
                {'- Vinter'}
              </p>
            </div>
          </div>
        </Popover>
      </Transition>
    </div>
  )
}
