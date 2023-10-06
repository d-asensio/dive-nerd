import { v1 as uuid } from 'uuid'
import {DivePlan} from "@/state/dive-plan/types";

export const initialDivePlan: DivePlan = {
  descentRate: 10,
  ascentRate: 9,
  diveLevelsMap: {
    [uuid()]: {
      depth: 20,
      duration: 30,
      gasMix: {
        fO2: 0.21,
        fHe: 0
      }
    }
  }
};
