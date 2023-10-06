import { v1 as uuid } from 'uuid'
import {DivePlanState} from "@/state/dive-plan/types";


const firstLevelId = uuid()

export const initialDivePlan: DivePlanState = {
  descentRate: 10,
  ascentRate: 9,
  diveLevelsMap: {
    [firstLevelId]: {
      depth: 20,
      duration: 30,
      gasMix: {
        fO2: 0.21,
        fHe: 0
      }
    }
  },
  diveLevelsIdList: [firstLevelId]
};
