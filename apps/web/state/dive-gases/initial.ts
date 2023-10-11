import { NIL, v1 as uuid } from 'uuid'
import {GasesState} from "@/state/dive-gases/types";


export const bottomGasId = NIL
export const deco21GasId = uuid()
export const deco6GasId = uuid()

export const initialGases: GasesState = {
  gasesMap: {
    [bottomGasId]: {
      fO2: 0.21,
      fHe: 0.22
    },
    [deco21GasId]: {
      fO2: 0.50,
      fHe: 0
    },
    [deco6GasId]: {
      fO2: 1,
      fHe: 0
    }
  },
  gasesIdList: [bottomGasId, deco21GasId, deco6GasId]
};
