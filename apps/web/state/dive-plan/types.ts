interface DivePlanLevel {
  depth: number
  duration: number
  gasId: string
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
