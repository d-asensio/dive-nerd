import {immer} from 'zustand/middleware/immer'
import {DivePlan, DivePlanLevel} from "@/state/dive-plan/types";

interface DivePlanActions {
  setDescentRate: (descentRate: number) => void
  setAscentRate: (ascentRate: number) => void
  addDiveLevel: (level: DivePlanLevel) => void
  removeDiveLevel: (levelIndex: number) => void
}

export type DivePlanSlice =
  DivePlan &
  DivePlanActions

interface DivePlanSliceFactoryDependencies {
  initialDivePlan: DivePlan
}

export const createDivePlanSlice =
  ({ initialDivePlan }: DivePlanSliceFactoryDependencies) =>
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
      addDiveLevel: level =>
        set(state => {
          state.diveLevels.push(level)
        }),
      removeDiveLevel: levelIndex =>
        set(state => {
          state.diveLevels.splice(levelIndex, 1)
        }),
    }))
