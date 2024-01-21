import {immer} from 'zustand/middleware/immer'
import {DivePlanState, DivePlanLevel} from "@/state/dive-plan/types";
import {mapObjIndexed} from "ramda";
import {NIL} from "uuid";

interface DivePlanActions {
  setDescentRate: (descentRate: number) => void
  setAscentRate: (ascentRate: number) => void
  addDiveLevel: (levelId: string, level: DivePlanLevel) => void
  updateDiveLevel: (levelId: string, newProps: Partial<DivePlanLevel>) => void
  removeDiveLevel: (levelId: string) => void
  unlinkGasFromLevels: (gasId: string) => void
}

export type DivePlanSlice =
  DivePlanState &
  DivePlanActions

interface DivePlanSliceFactoryDependencies {
  initialDivePlan: DivePlanState
}

export const createDivePlanSlice =
  ({
     initialDivePlan
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
      addDiveLevel: (levelId, level) => {
        set(state => {
          state.diveLevelsMap[levelId] = level
          state.diveLevelsIdList.push(levelId)
        })
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
      unlinkGasFromLevels: (gasId) => {
        set(state => {
          state.diveLevelsMap = mapObjIndexed(level => {
            if (level.gasId !== gasId) return level

            return {
              ...level,
              gasId: NIL
            }
          }, state.diveLevelsMap)
        })
      },
    }))
