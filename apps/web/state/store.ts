import { createStore } from 'zustand/vanilla'

interface DivePlanLevel {
  depth: number
  duration: number
  gasId: string
}

interface DivePlan {
  descentRate: number
  ascentRate: number
  levels: DivePlanLevel[]
}

interface Gas {
  fractionO2: number
  fractionHe: number
}

interface State {
  surfaceAmbientPressure: number
  waterDensity: number
  respiratoryQuotient: number
  divePlan: DivePlan
  gases: Record<string, Gas>
}

export default createStore<State>(() => ({
  surfaceAmbientPressure: 1.0133, // bar
  waterDensity:  1023.6,          // kg/m3
  respiratoryQuotient: 0.9,
  divePlan: {
    descentRate: 10,              // m/min.
    ascentRate: 9,                // m/min.
    levels: [
      {
        depth: 20,
        duration: 30,
        gasId: '21/00'
      }
    ]
  },
  gases: {
    '21/00': {
      fractionO2: 0.21,
      fractionHe: 0
    }
  }
}))
