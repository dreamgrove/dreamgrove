import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer>
      <div className="mt-5 flex flex-col items-center">
        <nav
          aria-label="Footer"
          className="mb-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400"
        >
          <Link href="/blog">Guides</Link>
          <Link href="/dungeons">Dungeons</Link>
          <Link href="/raids">Raids</Link>
          <Link href="/changelog">Changelog</Link>
          <Link href="/planner">Spell Planner</Link>
          <Link href="/about">About</Link>
        </nav>
        <div className="mb-3 flex space-x-4">
          <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={6} />
          <SocialIcon kind="github" href={siteMetadata.github} size={6} />
          <SocialIcon kind="facebook" href={siteMetadata.facebook} size={6} />
          <SocialIcon kind="youtube" href={siteMetadata.youtube} size={6} />
          <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={6} />
          <SocialIcon kind="twitter" href={siteMetadata.twitter} size={6} />
          <SocialIcon kind="x" href={siteMetadata.x} size={6} />
          <SocialIcon kind="instagram" href={siteMetadata.instagram} size={6} />
          <SocialIcon kind="threads" href={siteMetadata.threads} size={6} />
        </div>
        <div className="mb-8 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>{siteMetadata.author}</div>
          <div>{` • `}</div>
          <Link href="https://docs.google.com/document/d/1UTaAbYKaCy7U8xpWfxbJOq9Ds3pUmIGwj1KAAgyk91I/edit?tab=t.0">
            {`© ${new Date().getFullYear()}`}
          </Link>
          <div>{` • `}</div>
          <Link href="/">{siteMetadata.title}</Link>
        </div>
      </div>
    </footer>
  )
}
