import Link from './Link'
import siteMetadata from '@/data/siteMetadata'

const links = [
  { href: '/planner', title: 'Planner' },
  { href: '/about', title: 'About' },
  { href: 'https://discord.com/invite/dreamgrove', title: 'Discord' },
]

export default function Footer() {
  return (
    <footer className="site-footer mx-auto w-full">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-gray-300 pt-9 pb-11 dark:border-[#3a3a3a]">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-familiar-pro text-lg font-bold text-gray-900 dark:text-white">
            dreamgrove<span className="text-main">.</span>gg
          </span>
          <span aria-hidden className="text-sm text-gray-500 dark:text-white/40">
            ·
          </span>
          <Link
            href="https://docs.google.com/document/d/1UTaAbYKaCy7U8xpWfxbJOq9Ds3pUmIGwj1KAAgyk91I/edit?tab=t.0"
            className="text-sm text-gray-500 hover:text-gray-900 dark:text-white/40 dark:hover:text-white"
          >
            vinter
          </Link>
        </div>
        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-x-[22px] gap-y-2 text-[.92rem] font-semibold"
        >
          <Link href={siteMetadata.siteRepo} className="text-main hover:text-[#dd6b20]">
            Contribute on GitHub
          </Link>
          {links.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="text-gray-600 hover:text-gray-900 dark:text-white/60 dark:hover:text-white"
            >
              {link.title}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
