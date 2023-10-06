import {create} from 'zustand'

import {createDivePlanSlice, DivePlanSlice} from "@/state/dive-plan/slice";
import {initialDivePlan} from "@/state/dive-plan/initial";
import * as React from "react";

export type StoreState = DivePlanSlice

export const useStore = create<StoreState>((...a) => ({
  ...createDivePlanSlice({ initialDivePlan })(...a)
}))

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

export const useSelector = <R, A>(selector: (state: StoreState, ...args: A[]) => R, ...args: A[]) =>
  useStore(
    React.useCallback(
      (state: StoreState) => selector(state, ...args),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      args
    )
  )
