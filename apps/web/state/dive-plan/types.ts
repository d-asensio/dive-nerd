interface DivePlanLevel {
  depth: number
  duration: number
  gasId: string
}

interface DivePlan {
  descentRate: number
  ascentRate: number
  sacRate: number            // Surface Air Consumption rate, litres/minute at the surface
  gradientFactorLow: number  // 0..1
  gradientFactorHigh: number // 0..1
  switchAtMod: boolean       // force a procedural switch stop at each deco gas's MOD
  lastStopDepth: number      // 3 (default) or 6 — depth of the last deco stop
  showCeiling: boolean       // overlay the Bühlmann ceiling line + forbidden zone on the profile chart
  showGasSwitches: boolean   // draw the gas-switch markers on the dive profile line
  showIndividualCompartments: boolean // render the per-compartment gas-load charts below the profile chart
  showCompartments: boolean  // render the combined compartments inert-gas load profile chart
  diveLevelsMap: Record<string, DivePlanLevel>
}

interface DivePlanState extends DivePlan {
  diveLevelsIdList: string[]
}

export type {DivePlanState, DivePlanLevel};
