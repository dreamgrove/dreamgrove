'use client'

import { useEffect, useState } from 'react'
import type { BossAbilitiesResponse } from '@/types/bossAbilities'

// One request per encounter per page
const requests = new Map<string, Promise<BossAbilitiesResponse | null>>()

function fetchBossAbilities(encounterId: string): Promise<BossAbilitiesResponse | null> {
  let request = requests.get(encounterId)
  if (!request) {
    request = fetch(
      `/api/warcraft-logs/boss-abilities?encounterId=${encodeURIComponent(encounterId)}`
    )
      .then((res) => (res.ok ? (res.json() as Promise<BossAbilitiesResponse>) : null))
      .catch((e) => {
        console.warn('Boss abilities fetch failed', e)
        return null
      })
      .then((data) => {
        // a failed or empty lookup is retried on the next mount
        if (!data?.abilities?.length) requests.delete(encounterId)
        return data
      })
    requests.set(encounterId, request)
  }
  return request
}

/** wclogs boss abilities for an encounter. */
export function useBossAbilities(encounterId: string | null | undefined) {
  const [result, setResult] = useState<{ id: string; data: BossAbilitiesResponse | null }>()

  useEffect(() => {
    if (!encounterId) return
    let cancelled = false
    fetchBossAbilities(encounterId).then((data) => {
      if (!cancelled) setResult({ id: encounterId, data })
    })
    return () => {
      cancelled = true
    }
  }, [encounterId])

  if (!encounterId) return { data: null, loading: false }
  if (result?.id !== encounterId) return { data: null, loading: true }
  return { data: result.data, loading: false }
}
