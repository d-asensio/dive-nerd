import { DivePlanState } from "@/state/dive-plan/types";
import { v1 as uuid } from 'uuid'
import { bottomGasId } from "@/state/dive-gases/initial";

const diveLevelsMap = {
  [uuid()]: {
    depth: 45,
    duration: 30,
    gasId: bottomGasId
  }
}

export const initialDivePlan: DivePlanState = {
  descentRate: 20,
  ascentRate: 9,
  sacRate: 20,
  gradientFactorLow: 0.3,
  gradientFactorHigh: 0.85,
  switchAtMod: true,
  lastStopDepth: 6,
  circuit: 'OC',
  setpointLow: 0.7,
  setpointHigh: 1.3,
  diluentGasId: bottomGasId,
  showCeiling: false,
  showGasSwitches: true,
  showIndividualCompartments: false,
  showCompartments: false,
  diveLevelsMap,
  diveLevelsIdList: Object.keys(diveLevelsMap)
}
