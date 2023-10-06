import {create} from 'zustand'

import {createDivePlanSlice, DivePlanSlice} from "@/state/dive-plan/slice";
import {initialDivePlan} from "@/state/dive-plan/initial";

import {createDiveGasesSlice, GasesSlice} from "@/state/dive-gases/slice";
import {initialGases} from "@/state/dive-gases/initial";

import {createSelectors} from "@/state/createSelectors";

export type StoreState =
  DivePlanSlice &
  GasesSlice

export const useStore = createSelectors(
  create<StoreState>((...a) => ({
    ...createDivePlanSlice({ initialDivePlan })(...a),
    ...createDiveGasesSlice({ initialGases })(...a)
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

