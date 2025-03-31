import Main from './Main'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import PageWrapper from '@/components/PageWrapper'

export const metadata: Metadata = {
  title: 'Home',
  description: siteMetadata.description,
}

export default function Page() {
  return (
    <PageWrapper title="Main" showTitle={false}>
      <Main />
    </PageWrapper>
  )
}
