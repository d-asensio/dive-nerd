import {DivePlanLevel, DivePlanState} from "@/state/dive-plan/types";

export function divePlanBuilder() {
  const builder = {
    withAscentRate,
    withDescentRate,
    withShowCeiling,
    withLevels,
    withoutLevels,
    build
  }

  let divePlan: DivePlanState = {
    descentRate: 10,
    ascentRate: 9,
    gradientFactorLow: 0.3,
    gradientFactorHigh: 0.85,
    switchAtMod: true,
    lastStopDepth: 6,
    showCeiling: true,
    showIndividualCompartments: false,
    showCompartments: false,
    diveLevelsMap: {},
    diveLevelsIdList: []
  }

  function withDescentRate(descentRate: number) {
    divePlan.descentRate = descentRate
    return builder
  }

  function withAscentRate(ascentRate: number) {
    divePlan.ascentRate = ascentRate
    return builder
  }

  function withShowCeiling(showCeiling: boolean) {
    divePlan.showCeiling = showCeiling
    return builder
  }

  function withLevels(levels: Record<string, DivePlanLevel>) {
    divePlan.diveLevelsMap = levels
    divePlan.diveLevelsIdList = Object.keys(divePlan.diveLevelsMap)
    return builder
  }

  function withoutLevels() {
    divePlan.diveLevelsMap = {}
    divePlan.diveLevelsIdList = []
    return builder
  }

  function build() {
    return divePlan
  }

  return builder
}
