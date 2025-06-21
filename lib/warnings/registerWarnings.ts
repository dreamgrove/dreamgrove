import { findMissedCastOpportunities } from './missedCasts'
import { findBalanceCDEfficiency } from './balanceCDEfficiency'

export const registerWarnings = [
  {
    name: 'missedCasts',
    warning: findMissedCastOpportunities,
    spec: ['balance', 'feral', 'guardian', 'resto'],
  },
  {
    name: 'balanceCDEfficiency',
    warning: findBalanceCDEfficiency,
    spec: ['balance'],
  },
]
