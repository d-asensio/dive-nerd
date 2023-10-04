import { immer } from 'zustand/middleware/immer'

interface Gas {
  fractionO2: number
  fractionHe: number
}

interface DivePlanLevel {
  depth: number
  duration: number
  gas: Gas
}

interface DivePlan {
  descentRate: number
  ascentRate: number
  levels: DivePlanLevel[]
}

interface DivePlanActions {
  setDescentRate: (descentRate: number) => void
  setAscentRate: (ascentRate: number) => void
  addDiveLevel: (level: DivePlanLevel) => void
  removeDiveLevel: (levelIndex: number) => void
}

type DivePlanSlice =
  DivePlan &
  DivePlanActions

export const createDivePlanSlice =
  (initialDivePlan: DivePlan) => immer<DivePlanSlice>((set) => ({
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
        state.levels.push(level)
      }),
    removeDiveLevel: levelIndex =>
      set(state => {
        state.levels.splice(levelIndex, 1)
      }),
  }))

export type { DivePlan, DivePlanLevel, DivePlanSlice }
