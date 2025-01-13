'use client'
import { FaCircleInfo } from 'react-icons/fa6'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function ContributeHeader() {
  const url = usePathname()
  return (
    <div className="my-[20px] flex items-center rounded-md bg-blue-300/30 p-4 text-left">
      <FaCircleInfo className="inline" />

      <span className="ml-2">
        This is a community curated resource. If you want to contribute, click{' '}
        <Link
          className="font-sans font-bold text-main underline"
          href={`https://github.com/dreamgrove/dreamgrove/edit/master/data${url}.mdx`}
        >
          here
        </Link>
      </span>
    </div>
  )
}
