import {create} from 'zustand'

import {createDivePlanSlice, DivePlanSlice} from "@/state/dive-plan/slice";
import {initialDivePlan} from "@/state/dive-plan/initial";
import {createSelectors} from "@/state/createSelectors";

export type StoreState = DivePlanSlice

export const useStore = createSelectors(
  create<StoreState>((...a) => ({
    ...createDivePlanSlice({ initialDivePlan })(...a)
  }))
)

interface Gas {
  fractionO2: number
  fractionHe: number
}

interface State {
  surfaceAmbientPressure: number
  waterDensity: number
  respiratoryQuotient: number
  gases: Record<string, Gas>
}

