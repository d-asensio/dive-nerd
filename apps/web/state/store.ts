import {create} from 'zustand'
import { setAutoFreeze } from 'immer';

import {createDivePlanSlice, DivePlanSlice} from "@/state/dive-plan/slice";
import {initialDivePlan} from "@/state/dive-plan/initial";

import {createDiveGasesSlice, GasesSlice} from "@/state/dive-gases/slice";
import {initialGases} from "@/state/dive-gases/initial";

import {createUiSlice, UiSlice} from "@/state/ui/slice";

import {createSelectors} from "@/state/createSelectors";

setAutoFreeze(false);

export type StoreState =
  DivePlanSlice &
  GasesSlice &
  UiSlice

export const useStore = createSelectors(
  create<StoreState>((...a) => ({
    ...createDivePlanSlice({ initialDivePlan })(...a),
    ...createDiveGasesSlice({ initialGases })(...a),
    ...createUiSlice()(...a)
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

