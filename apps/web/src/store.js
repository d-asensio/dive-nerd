import createStoreHook from 'zustand'
import createStore from 'zustand/vanilla'

const initialState = {
  diveIdList: []
}

export const store = createStore(
  () => initialState
)

export const useSelector = createStoreHook(store)
