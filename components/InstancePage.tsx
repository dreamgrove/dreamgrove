import type { Dungeons, Raids } from 'contentlayer/generated'
import { MDXLayoutRenderer } from '@/components/MDXLayoutRenderer'
import PageWrapper from '@/components/PageWrapper'
import DungeonLayout from '@/layouts/DungeonLayout'
import { coreContent } from '@/lib/utils/contentlayer'
import { jsonLdHtml } from '@/lib/utils/jsonLd'
import { genArticleMetadata } from '@/lib/seo'

type Instance = Dungeons | Raids

export function instanceMetadata(post: Instance) {
  return genArticleMetadata({
    title: post.title,
    summary: post.summary,
    images: post.headerImage ? [`/static/images/${post.headerImage}`] : undefined,
  })
}

/** Page body shared by the /dungeons/* and /raids/* guide routes. */
export default function InstancePage({ post }: { post: Instance }) {
  return (
    <PageWrapper title={post.title} showTitle={false} variant="redesign">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(post.structuredData) }}
      />
      <DungeonLayout content={coreContent(post)}>
        <MDXLayoutRenderer code={post.body.code} toc={post.toc} />
      </DungeonLayout>
    </PageWrapper>
  )
}
