import { v1 as uuid } from 'uuid'
import {DivePlanState} from "@/state/dive-plan/types";
import {initialGases} from "@/state/dive-gases/initial";


const firstLevelId = uuid()

export const initialDivePlan: DivePlanState = {
  descentRate: 10,
  ascentRate: 9,
  diveLevelsMap: {
    [firstLevelId]: {
      depth: 20,
      duration: 30,
      gasMixId: initialGases.mixesIdList[0]
    }
  },
  diveLevelsIdList: [firstLevelId]
};
