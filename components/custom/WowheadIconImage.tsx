'use client'

import Image from 'next/image'
import { useState } from 'react'

interface WowheadIconImageProps {
  src: string
  alt: string
  iconSize: number
  fill: boolean
  noMargin: boolean
}

// Renders an icon and hides it only if the browser actually fails to load it.
// This replaces the old server-side HEAD probe whose result got frozen into the
// statically-generated HTML: a transient CDN blip during a revalidation made icons
// disappear for hours. Deciding client-side per load means a missing icon is hidden
// but a momentarily-slow CDN never bakes "missing" into the cached page.
export default function WowheadIconImage({
  src,
  alt,
  iconSize,
  fill,
  noMargin,
}: WowheadIconImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return null
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={fill ? undefined : iconSize}
      height={fill ? undefined : iconSize}
      fill={fill}
      // These icons are 16-50px; optimization saves nothing but the single-host Next
      // optimizer is a bottleneck (and dreamgrove.gg has no CDN in front of it).
      // Serving unoptimized lets the browser fetch straight from the icon CDN, which
      // Cloudflare/Wowhead cache for us.
      unoptimized
      onError={() => setFailed(true)}
      className={fill ? 'object-contain' : `my-0 inline-block ${!noMargin && 'mr-1'}`}
    />
  )
}
