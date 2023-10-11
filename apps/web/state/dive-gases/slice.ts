import {v1 as defaultGenerateUUID} from 'uuid'
import {immer} from 'zustand/middleware/immer'
import {Gas} from "@/utils/types";
import {GasesState} from "@/state/dive-gases/types";

interface GasesActions {
  addGas: (gas: Gas) => string
  updateGas: (gasId: string, newProps: Partial<Gas>) => void
  removeGas: (gasId: string) => void
}

export type GasesSlice =
  GasesState &
  GasesActions

interface DivePlanSliceFactoryDependencies {
  initialGases: GasesState
  generateUUID?: typeof defaultGenerateUUID
}

export const createDiveGasesSlice =
  ({
     initialGases,
     generateUUID = defaultGenerateUUID
   }: DivePlanSliceFactoryDependencies) =>
    immer<GasesSlice>((set) => ({
      ...initialGases,
      addGas: gas => {
        const newUuid = generateUUID()

        set(state => {
          state.gasesMap[newUuid] = gas
          state.gasesIdList.push(newUuid)
        })

        return newUuid
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
