import { v1 as uuid } from 'uuid'
import {DivePlanState} from "@/state/dive-plan/types";
import {bottomGasId, deco21GasId, deco6GasId} from "@/state/dive-gases/initial";


const diveLevelsMap = {
  [uuid()]: {
    depth: 45,
    duration: 30,
    gasId: bottomGasId
  },
  [uuid()]: {
    depth: 21,
    duration: 2,
    gasId: deco21GasId
  },
  [uuid()]: {
    depth: 18,
    duration: 2,
    gasId: deco21GasId
  },
  [uuid()]: {
    depth: 15,
    duration: 4,
    gasId: deco21GasId
  },
  [uuid()]: {
    depth: 12,
    duration: 5,
    gasId: deco21GasId
  },
  [uuid()]: {
    depth: 9,
    duration: 8,
    gasId: deco21GasId
  },
  [uuid()]: {
    depth: 6,
    duration: 68,
    gasId: deco6GasId
  },
  [uuid()]: {
    depth: 0,
    duration: 0,
    gasId: deco6GasId
  }
}

export const initialDivePlan: DivePlanState = {
  descentRate: 10,
  ascentRate: 9,
  diveLevelsMap,
  diveLevelsIdList: Object.keys(diveLevelsMap)
}
