import { notFound } from 'next/navigation'
import { allRaids } from 'contentlayer/generated'
import InstancePage, { instanceMetadata } from '@/components/InstancePage'
import { findPublished, slugParams } from '@/lib/utils/contentlayer'

type Props = { params: Promise<{ slug: string[] }> }

export const generateStaticParams = () => slugParams(allRaids)

export async function generateMetadata({ params }: Props) {
  const post = findPublished(allRaids, (await params).slug)
  return post ? instanceMetadata(post) : undefined
}

export default async function Page({ params }: Props) {
  const post = findPublished(allRaids, (await params).slug)
  if (!post) notFound()
  return <InstancePage post={post} />
}
