'use client'

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react'
import Image from 'next/image'

// Date gate: April 1st CEST (UTC+2)
function isAprilFoolsCEST(): boolean {
  const now = new Date()
  const cestOffset = 2 * 60 // UTC+2 in minutes
  const cestTime = new Date(now.getTime() + cestOffset * 60 * 1000)
  const cestMonth = cestTime.getUTCMonth() // 0-indexed, April = 3
  const cestDay = cestTime.getUTCDate()
  return cestMonth === 3 && cestDay === 1
}

// SSR-safe mounted check
function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

interface FakeSite {
  name: string
  url: string
  bannerSrc: string
  popupSrc: string
}

const FAKE_SITES: FakeSite[] = [
  {
    name: 'VoidWhispr',
    url: 'https://voidwhispr.org',
    bannerSrc: '/static/images/april/banners/whispr.jpg',
    popupSrc: '/static/images/april/banners/voidwhispr-popup.jpg',
  },
  {
    name: 'Azeroth Weather',
    url: 'https://azerothweather.org',
    bannerSrc: '/static/images/april/banners/weather-leader.jpg',
    popupSrc: '/static/images/april/banners/weather-popup.jpg',
  },
  {
    name: 'Learn Thalassian',
    url: 'https://learn-thalassian.org',
    bannerSrc: '/static/images/april/banners/thalassian-leader.jpg',
    popupSrc: '/static/images/april/banners/thalassian-popup.jpg',
  },
  {
    name: "Pugger's Insurance",
    url: 'https://puggers-insurance.org',
    bannerSrc: '/static/images/april/banners/puggers-leader.jpg',
    popupSrc: '/static/images/april/banners/insurance-popup.jpg',
  },
  {
    name: 'Mythic Counseling',
    url: 'https://mythic-counseling.org',
    bannerSrc: '/static/images/april/banners/counseling-leader.jpg',
    popupSrc: '/static/images/april/banners/counseling-popup.jpg',
  },
  {
    name: 'Astral Power',
    url: 'https://astral-power.org',
    bannerSrc: '/static/images/april/banners/astral-leader.jpg',
    popupSrc: '/static/images/april/banners/astral-popup.jpg',
  },
]

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/** Static banner ad placed inline in the page */
export function AprilFoolsBanner({ className = '' }: { className?: string }) {
  const mounted = useMounted()
  // Lazy initializer — runs once, no effect needed
  const [site] = useState<FakeSite>(() => pickRandom(FAKE_SITES))

  if (!mounted || !isAprilFoolsCEST()) return null

  return (
    <div className={`flex justify-center py-3 ${className}`}>
      <a href={site.url} target="_blank" rel="noopener noreferrer" className="block">
        <Image
          src={site.bannerSrc}
          alt="Advertisement"
          width={728}
          height={90}
          className="rounded shadow-md transition-transform hover:scale-[1.02]"
          style={{ maxWidth: '100%', height: 'auto' }}
          unoptimized
        />
      </a>
    </div>
  )
}

/** Multiple static banners scattered through content */
export function AprilFoolsBannerSet({ count = 3 }: { count?: number }) {
  const mounted = useMounted()
  const [sites] = useState<FakeSite[]>(() => shuffleArray(FAKE_SITES).slice(0, count))

  if (!mounted || !isAprilFoolsCEST()) return null

  return (
    <>
      {sites.map((site, i) => (
        <div key={i} className="flex justify-center py-3">
          <a href={site.url} target="_blank" rel="noopener noreferrer" className="block">
            <Image
              src={site.bannerSrc}
              alt="Advertisement"
              width={728}
              height={90}
              className="max-w-full rounded shadow-md transition-transform hover:scale-[1.02]"
              style={{ height: 'auto' }}
              unoptimized
            />
          </a>
        </div>
      ))}
    </>
  )
}

/** Inner popup overlay — uses key to reset countdown on each appearance */
function PopupOverlay({ site, onClose }: { site: FakeSite; onClose: () => void }) {
  const [countdown, setCountdown] = useState(5)
  const [canClose, setCanClose] = useState(false)

  useEffect(() => {
    let count = 5
    const interval = setInterval(() => {
      count -= 1
      if (count <= 0) {
        clearInterval(interval)
        setCanClose(true)
        setCountdown(0)
      } else {
        setCountdown(count)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="animate-bounce-once relative mx-4 rounded-lg border-2 border-yellow-400 bg-white shadow-2xl dark:border-yellow-500 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-100 px-3 py-1.5 dark:border-gray-700 dark:bg-gray-800">
          <span className="text-xs font-bold tracking-wider text-red-600 uppercase dark:text-red-400">
            Special Offer!
          </span>
          <button
            onClick={canClose ? onClose : undefined}
            disabled={!canClose}
            className={`rounded px-2 py-0.5 text-xs font-bold transition-colors ${
              canClose
                ? 'cursor-pointer bg-red-500 text-white hover:bg-red-600'
                : 'cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400'
            }`}
          >
            {canClose ? 'X Close' : `Wait ${countdown}s...`}
          </button>
        </div>
        <a href={site.url} target="_blank" rel="noopener noreferrer" className="block">
          <Image
            src={site.popupSrc}
            alt="Special offer"
            width={400}
            height={300}
            className="rounded-b-lg"
            unoptimized
          />
        </a>
      </div>
    </div>
  )
}

/** Popup ad that appears after a random delay, requires 5s wait to close */
export function AprilFoolsPopup() {
  const mounted = useMounted()
  // popupKey increments each time a new popup appears, resetting countdown via key prop
  const [popupKey, setPopupKey] = useState(0)
  const [active, setActive] = useState(false)
  const [site, setSite] = useState<FakeSite>(() => pickRandom(FAKE_SITES))

  useEffect(() => {
    if (!mounted || !isAprilFoolsCEST()) return

    // Show popup after a random delay between 2-8 seconds
    const delay = 2000 + Math.random() * 6000
    const timer = setTimeout(() => setActive(true), delay)
    return () => clearTimeout(timer)
  }, [mounted])

  const handleClose = useCallback(() => {
    setActive(false)

    // Schedule another popup after 30-90 seconds
    const nextDelay = 30000 + Math.random() * 60000
    setTimeout(() => {
      setSite(pickRandom(FAKE_SITES))
      setPopupKey((k) => k + 1)
      setActive(true)
    }, nextDelay)
  }, [])

  if (!active || !mounted) return null

  return <PopupOverlay key={popupKey} site={site} onClose={handleClose} />
}

/** Combined component: renders both banners and popup */
export default function AprilFoolsAds({ bannerCount = 3 }: { bannerCount?: number }) {
  const mounted = useMounted()

  if (!mounted || !isAprilFoolsCEST()) return null

  return (
    <>
      <AprilFoolsBannerSet count={bannerCount} />
      <AprilFoolsPopup />
    </>
  )
}
