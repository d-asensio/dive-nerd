import { v1 as uuid } from 'uuid'
import {DivePlanState} from "@/state/dive-plan/types";
import {bottomMixId, deco21MixId, deco6MixId} from "@/state/dive-gases/initial";


const diveLevelsMap = {
  [uuid()]: {
    depth: 45,
    duration: 30,
    gasMixId: bottomMixId
  },
  [uuid()]: {
    depth: 21,
    duration: 2,
    gasMixId: deco21MixId
  },
  [uuid()]: {
    depth: 18,
    duration: 2,
    gasMixId: deco21MixId
  },
  [uuid()]: {
    depth: 15,
    duration: 4,
    gasMixId: deco21MixId
  },
  [uuid()]: {
    depth: 12,
    duration: 5,
    gasMixId: deco21MixId
  },
  [uuid()]: {
    depth: 9,
    duration: 8,
    gasMixId: deco21MixId
  },
  [uuid()]: {
    depth: 6,
    duration: 68,
    gasMixId: deco6MixId
  },
  [uuid()]: {
    depth: 0,
    duration: 0,
    gasMixId: deco6MixId
  }
}

export const initialDivePlan: DivePlanState = {
  descentRate: 10,
  ascentRate: 9,
  diveLevelsMap,
  diveLevelsIdList: Object.keys(diveLevelsMap)
}
