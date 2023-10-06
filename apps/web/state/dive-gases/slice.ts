import {v1 as defaultGenerateUUID} from 'uuid'
import {immer} from 'zustand/middleware/immer'
import {GasMix} from "@/utils/types";
import {GasesState} from "@/state/dive-gases/types";

interface GasesActions {
  addGasMix: (mix: GasMix) => string
  updateGasMix: (mixId: string, newProps: Partial<GasMix>) => void
  removeGasMix: (mixId: string) => void
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
      addGasMix: mix => {
        const newUuid = generateUUID()

        set(state => {
          state.mixesMap[newUuid] = mix
          state.mixesIdList.push(newUuid)
        })

        return newUuid
      },
      updateGasMix: (mixId, newProps) =>
        set(state => {
          if (!state.mixesMap[mixId]) return

          state.mixesMap[mixId] = {
            ...state.mixesMap[mixId],
            ...newProps
          }
        }),
      removeGasMix: mixId =>
        set(state => {
          delete state.mixesMap[mixId]
          state.mixesIdList = state.mixesIdList.filter(id => id !== mixId)
        }),
    }))
