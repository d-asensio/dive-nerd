import { v1 as uuid } from 'uuid'
import {DivePlanState} from "@/state/dive-plan/types";
import {bottomGasId, deco21GasId, deco6GasId} from "@/state/dive-gases/initial";


const diveLevelsMap = {
  [uuid()]: {
    depth: 45,
    duration: 30,
    gasId: bottomGasId
  }
}

export const initialDivePlan: DivePlanState = {
  descentRate: 10,
  ascentRate: 9,
  diveLevelsMap,
  diveLevelsIdList: Object.keys(diveLevelsMap)
}
