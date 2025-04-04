import PageWrapper from '@/components/PageWrapper'
import Main from './Main'

// Force static generation
export const dynamic = 'force-static'

export default function Page() {
  return (
    <PageWrapper title="Main" showTitle={false}>
      <Main />
    </PageWrapper>
  )
}
