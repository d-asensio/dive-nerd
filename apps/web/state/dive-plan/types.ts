interface GasMix {
  fO2: number
  fHe: number
}

interface DivePlanLevel {
  depth: number
  duration: number
  gasMix: GasMix
}

interface DivePlan {
  descentRate: number
  ascentRate: number
  diveLevels: DivePlanLevel[]
}

export type {DivePlan, DivePlanLevel};
