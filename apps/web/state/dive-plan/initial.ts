import { v1 as uuid } from 'uuid'
import {DivePlanState} from "@/state/dive-plan/types";
import {initialGases} from "@/state/dive-gases/initial";


const diveLevelsMap = {
  [uuid()]: {
    depth: 45,
    duration: 30,
    gasMixId: initialGases.mixesIdList[0]
  },
  [uuid()]: {
    depth: 21,
    duration: 2,
    gasMixId: initialGases.mixesIdList[0]
  },
  [uuid()]: {
    depth: 18,
    duration: 2,
    gasMixId: initialGases.mixesIdList[0]
  },
  [uuid()]: {
    depth: 15,
    duration: 4,
    gasMixId: initialGases.mixesIdList[0]
  },
  [uuid()]: {
    depth: 12,
    duration: 5,
    gasMixId: initialGases.mixesIdList[0]
  },
  [uuid()]: {
    depth: 9,
    duration: 8,
    gasMixId: initialGases.mixesIdList[0]
  },
  [uuid()]: {
    depth: 6,
    duration: 68,
    gasMixId: initialGases.mixesIdList[0]
  },
  [uuid()]: {
    depth: 0,
    duration: 0,
    gasMixId: initialGases.mixesIdList[0]
  }
}

export const initialDivePlan: DivePlanState = {
  descentRate: 10,
  ascentRate: 9,
  diveLevelsMap,
  diveLevelsIdList: Object.keys(diveLevelsMap)
}
