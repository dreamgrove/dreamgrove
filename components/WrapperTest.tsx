import { allBlogs, Blog } from 'contentlayer/generated'
import TableOfContents from './custom/TableOfContents'

export default function WrapperTest({ slug, toggleNav }) {
  const post = allBlogs.find((p) => p.slug === slug) as Blog
  if (!post) return <></>
  return <TableOfContents chapters={post.toc} inSidebar toggleNav={toggleNav} />
}
