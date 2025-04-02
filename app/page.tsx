import Main from './Main'
import MainAprilFools from './MainAprilFools'
import PageWrapper from '@/components/PageWrapper'
import { isAprilFoolsServer } from './utils/serverDateUtils'

export default function Page() {
  const isAprilFirst = isAprilFoolsServer()

  return (
    <PageWrapper title="Main" showTitle={false}>
      {isAprilFirst ? <MainAprilFools /> : <Main />}
    </PageWrapper>
  )
}
