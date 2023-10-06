import { v1 as defaultGenerateUUID } from 'uuid'
import {immer} from 'zustand/middleware/immer'
import {DivePlanState, DivePlanLevel} from "@/state/dive-plan/types";

interface DivePlanActions {
  setDescentRate: (descentRate: number) => void
  setAscentRate: (ascentRate: number) => void
  addDiveLevel: (level: DivePlanLevel) => string
  updateDiveLevel: (levelId: string, newProps: Partial<DivePlanLevel>) => void
  removeDiveLevel: (levelId: string) => void
}

export type DivePlanSlice =
  DivePlanState &
  DivePlanActions

interface DivePlanSliceFactoryDependencies {
  initialDivePlan: DivePlanState
  generateUUID?: typeof defaultGenerateUUID
}

export const createDivePlanSlice =
  ({
     initialDivePlan,
     generateUUID = defaultGenerateUUID
  }: DivePlanSliceFactoryDependencies) =>
    immer<DivePlanSlice>((set) => ({
      ...initialDivePlan,
      setDescentRate: descentRate =>
        set(state => {
          state.descentRate = descentRate
        }),
      setAscentRate: ascentRate =>
        set(state => {
          state.ascentRate = ascentRate
        }),
      addDiveLevel: level => {
        const newUuid = generateUUID()

        set(state => {
          state.diveLevelsMap[newUuid] = level
          state.diveLevelsIdList.push(newUuid)
        })

        return newUuid
      },
      updateDiveLevel: (levelId, newProps) =>
        set(state => {
          if (!state.diveLevelsMap[levelId]) return

          state.diveLevelsMap[levelId] = {
            ...state.diveLevelsMap[levelId],
            ...newProps
          }
        }),
      removeDiveLevel: levelId =>
        set(state => {
          delete state.diveLevelsMap[levelId]
          state.diveLevelsIdList = state.diveLevelsIdList.filter(id => id !== levelId)
        }),
    }))
