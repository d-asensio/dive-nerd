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
