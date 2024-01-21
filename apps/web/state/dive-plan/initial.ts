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
  descentRate: 10,
  ascentRate: 9,
  diveLevelsMap,
  diveLevelsIdList: Object.keys(diveLevelsMap)
}
