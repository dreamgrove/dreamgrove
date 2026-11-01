import { Cast } from '@/models/Cast'

/** Spreads casts over one row per charge, round-robin in start order. */
export const splitCastsByCharges = (casts: Cast[], charges: number): Cast[][] => {
  if (!charges || charges <= 1) {
    return [casts]
  }

  const castsByCharge: Cast[][] = Array.from({ length: charges }, () => [])
  const sortedCasts = [...casts].sort((a, b) => a.start_s - b.start_s)

  // Distribute casts in round-robin fashion
  sortedCasts.forEach((cast, index) => {
    const chargeIndex = index % charges
    castsByCharge[chargeIndex].push(cast)
  })

  return castsByCharge
}
