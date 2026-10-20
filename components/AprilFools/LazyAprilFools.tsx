'use client'

import dynamic from 'next/dynamic'

// The ads only ever show on April 1st (and only after mount), so their code loads on
// demand instead of shipping with every guide all year.
const AprilFoolsAds = dynamic(() => import('./AprilFoolsAds'), { ssr: false })
const AprilFoolsBanner = dynamic(() => import('./AprilFoolsAds').then((m) => m.AprilFoolsBanner), {
  ssr: false,
})

// Same date gate as AprilFoolsAds: April 1st CEST (UTC+2)
function isAprilFoolsCEST(): boolean {
  const cestTime = new Date(Date.now() + 2 * 60 * 60 * 1000)
  return cestTime.getUTCMonth() === 3 && cestTime.getUTCDate() === 1
}

export function LazyAprilFoolsBanner(props: { className?: string }) {
  return isAprilFoolsCEST() ? <AprilFoolsBanner {...props} /> : null
}

export default function LazyAprilFoolsAds(props: { bannerCount?: number }) {
  return isAprilFoolsCEST() ? <AprilFoolsAds {...props} /> : null
}
