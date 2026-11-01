'use client'

import { useSyncExternalStore } from 'react'

// Picked once per page load in the browser. The 404 page is prerendered, so a
// pick during render would freeze one quote into the build for every visitor.
let pickedIndex: number | null = null
const subscribe = () => () => {}

/** One of `quotes` at random, rendered after hydration */
export default function RandomQuote({ quotes }: { quotes: string[] }) {
  const index = useSyncExternalStore(
    subscribe,
    () => (pickedIndex ??= Math.floor(Math.random() * quotes.length)),
    () => null
  )
  return index === null ? null : <p className="mb-8">"{quotes[index]}"</p>
}
