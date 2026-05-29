import {immer} from 'zustand/middleware/immer'

import {Tank, TanksState} from "@/state/tanks/types"

interface TanksActions {
  addTank: (tankId: string, tank: Tank) => void
  updateTank: (tankId: string, newProps: Partial<Tank>) => void
  removeTank: (tankId: string) => void
}

export type TanksSlice = TanksState & TanksActions

interface TanksSliceFactoryDependencies {
  initialTanks: TanksState
}

export const createTanksSlice = ({ initialTanks }: TanksSliceFactoryDependencies) =>
  immer<TanksSlice>((set) => ({
    ...initialTanks,
    addTank: (tankId, tank) =>
      set(state => {
        state.tanksMap[tankId] = tank
        state.tanksIdList.push(tankId)
      }),
    updateTank: (tankId, newProps) =>
      set(state => {
        if (!state.tanksMap[tankId]) return
        state.tanksMap[tankId] = { ...state.tanksMap[tankId], ...newProps }
      }),
    removeTank: tankId =>
      set(state => {
        delete state.tanksMap[tankId]
        state.tanksIdList = state.tanksIdList.filter(id => id !== tankId)
      }),
  }))
