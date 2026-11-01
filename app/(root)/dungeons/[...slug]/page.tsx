import { notFound } from 'next/navigation'
import { allDungeons } from 'contentlayer/generated'
import InstancePage, { instanceMetadata } from '@/components/InstancePage'
import { findPublished, slugParams } from '@/lib/utils/contentlayer'

type Props = { params: Promise<{ slug: string[] }> }

export const generateStaticParams = () => slugParams(allDungeons)

export async function generateMetadata({ params }: Props) {
  const post = findPublished(allDungeons, (await params).slug)
  return post ? instanceMetadata(post) : undefined
}

export default async function Page({ params }: Props) {
  const post = findPublished(allDungeons, (await params).slug)
  if (!post) notFound()
  return <InstancePage post={post} />
}
