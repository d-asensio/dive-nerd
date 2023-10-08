import { NIL, v1 as uuid } from 'uuid'
import {GasesState} from "@/state/dive-gases/types";


export const bottomMixId = NIL
export const deco21MixId = uuid()
export const deco6MixId = uuid()

export const initialGases: GasesState = {
  mixesMap: {
    [bottomMixId]: {
      fO2: 0.21,
      fHe: 0.22
    },
    [deco21MixId]: {
      fO2: 0.50,
      fHe: 0
    },
    [deco6MixId]: {
      fO2: 1,
      fHe: 0
    }
  },
  mixesIdList: [bottomMixId, deco21MixId, deco6MixId]
};
