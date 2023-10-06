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
  diveLevelsMap: Record<string, DivePlanLevel>
}

interface DivePlanState extends DivePlan {
  diveLevelsIdList: string[]
}

export type {DivePlanState, DivePlanLevel};
