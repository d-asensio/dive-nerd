interface Gas {
  fractionO2: number
  fractionHe: number
}

interface DivePlanLevel {
  depth: number
  duration: number
  gas: Gas
}

interface DivePlan {
  descentRate: number
  ascentRate: number
  diveLevels: DivePlanLevel[]
}

export type {DivePlan, DivePlanLevel};
