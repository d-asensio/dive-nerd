import { NIL } from 'uuid'
import {GasesState} from "@/state/dive-gases/types";


const firstMixId = NIL

export const initialGases: GasesState = {
  mixesMap: {
    [firstMixId]: {
      fO2: 0.21,
      fHe: 0
    },
  },
  mixesIdList: [firstMixId]
};
