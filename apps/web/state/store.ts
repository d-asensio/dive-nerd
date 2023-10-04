import { create } from 'zustand'
import {createDivePlanSlice, DivePlanSlice} from "@/state/slices/createDivePlanSlice";

type StoreState = DivePlanSlice

export const useStore = create<StoreState>((...a) => ({
  ...createDivePlanSlice({
    descentRate: 10,
    ascentRate: 9,
    levels: [
      {
        depth: 20,
        duration: 30,
        gas: {
          fractionO2: 0.21,
          fractionHe: 0
        }
      }
    ]
  })(...a)
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
