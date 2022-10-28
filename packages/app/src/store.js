import createStoreHook from 'zustand'
import createStore from 'zustand/vanilla'

import { mockDives } from '@divenerd/mock-dives'

const initialState = {
  divesById: mockDives,
  diveIdList: Object.keys(mockDives)
}

export const store = createStore(
  () => initialState
)

export const useSelector = createStoreHook(store)
