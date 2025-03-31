'use client'

import Main from './Main'
import MainAprilFools from './MainAprilFools'
import PageWrapper from '@/components/PageWrapper'
import { isAprilFools } from './utils/dateUtils'

export default function Page() {
  const isAprilFirst = isAprilFools()

  return (
    <PageWrapper title="Main" showTitle={false}>
      {isAprilFirst ? <MainAprilFools /> : <Main />}
    </PageWrapper>
  )
}
