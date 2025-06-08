import { findMissedCastOpportunities } from './missedCasts'
import { findBalanceCDEfficiency } from './balanceCDEfficiency'

/**
 * Result type for missed cast warnings
 */
export interface Warning {
  spellName: string
  warning: string
}

export const registerWarnings = [
  {
    name: 'missedCasts',
    warning: findMissedCastOpportunities,
    spec: ['balance'],
  },
  {
    name: 'balanceCDEfficiency',
    warning: findBalanceCDEfficiency,
    spec: ['balance'],
  },
]
