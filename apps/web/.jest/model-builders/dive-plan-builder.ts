import {DivePlanLevel, DivePlanState} from "@/state/dive-plan/types";

export function divePlanBuilder() {
  const builder = {
    withAscentRate,
    withDescentRate,
    withLevels,
    withoutLevels,
    build
  }

  let divePlan: DivePlanState = {
    descentRate: 10,
    ascentRate: 9,
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
