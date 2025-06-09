import { findMissedCastOpportunities } from './missedCasts'
import { findBalanceCDEfficiency } from './balanceCDEfficiency'

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
