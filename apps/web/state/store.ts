import {create, StoreApi, UseBoundStore } from 'zustand'

import {createDivePlanSlice, DivePlanSlice} from "@/state/dive-plan/slice";
import {initialDivePlan} from "@/state/dive-plan/initial";
import * as React from "react";

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S
) => {
  let store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (let k of Object.keys(store.getState())) {
    ;(store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
  }

  return store
}

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

export const useSelector = <R, A>(selector: (state: StoreState, ...args: A[]) => R, ...args: A[]) =>
  useStore(
    React.useCallback(
      (state: StoreState) => selector(state, ...args),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [...args, selector]
    )
  )
