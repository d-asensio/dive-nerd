interface DivePlanLevel {
  depth: number
  duration: number
  gasId: string
}

interface DivePlan {
  descentRate: number
  ascentRate: number
  gradientFactorLow: number  // 0..1
  gradientFactorHigh: number // 0..1
  switchAtMod: boolean       // force a procedural switch stop at each deco gas's MOD
  lastStopDepth: number      // 3 (default) or 6 — depth of the last deco stop
  diveLevelsMap: Record<string, DivePlanLevel>
}

interface DivePlanState extends DivePlan {
  diveLevelsIdList: string[]
}

export type {DivePlanState, DivePlanLevel};
