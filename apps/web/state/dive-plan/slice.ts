import { v1 as defaultGenerateUUID } from 'uuid'
import {immer} from 'zustand/middleware/immer'
import {DivePlan, DivePlanLevel} from "@/state/dive-plan/types";

interface DivePlanActions {
  setDescentRate: (descentRate: number) => void
  setAscentRate: (ascentRate: number) => void
  addDiveLevel: (level: DivePlanLevel) => string
  removeDiveLevel: (levelIndex: string) => void
}

export type DivePlanSlice =
  DivePlan &
  DivePlanActions

interface DivePlanSliceFactoryDependencies {
  initialDivePlan: DivePlan
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
          state.diveLevels[newUuid] = level
        })

        return newUuid
      },
      removeDiveLevel: newUuid =>
        set(state => {
          delete state.diveLevels[newUuid]
        }),
    }))
