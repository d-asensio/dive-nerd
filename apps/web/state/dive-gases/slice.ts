import {v1 as defaultGenerateUUID} from 'uuid'
import {immer} from 'zustand/middleware/immer'
import {Gas} from "@/utils/types";
import {GasesState} from "@/state/dive-gases/types";

interface GasesActions {
  addGas: (gasId: string, gas: Gas) => void
  updateGas: (gasId: string, newProps: Partial<Gas>) => void
  removeGas: (gasId: string) => void
}

export type GasesSlice =
  GasesState &
  GasesActions

interface DivePlanSliceFactoryDependencies {
  initialGases: GasesState
}

export const createDiveGasesSlice =
  ({
     initialGases
   }: DivePlanSliceFactoryDependencies) =>
    immer<GasesSlice>((set) => ({
      ...initialGases,
      addGas: (gasId, gas) => {
        set(state => {
          state.gasesMap[gasId] = gas
          state.gasesIdList.push(gasId)
        })
      },
      updateGas: (gasId, newProps) =>
        set(state => {
          if (!state.gasesMap[gasId]) return

          state.gasesMap[gasId] = {
            ...state.gasesMap[gasId],
            ...newProps
          }
        }),
      removeGas: gasId =>
        set(state => {
          delete state.gasesMap[gasId]
          state.gasesIdList = state.gasesIdList.filter(id => id !== gasId)
        }),
    }))
