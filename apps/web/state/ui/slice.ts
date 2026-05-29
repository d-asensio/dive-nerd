import {immer} from 'zustand/middleware/immer'

interface UiState {
  /** Time (minutes) currently hovered/pinned on the dive profile chart, or null. */
  hoverTime: number | null
}

interface UiActions {
  setHoverTime: (time: number | null) => void
}

export type UiSlice = UiState & UiActions

export const createUiSlice = () =>
  immer<UiSlice>((set) => ({
    hoverTime: null,
    setHoverTime: time =>
      set(state => {
        state.hoverTime = time
      }),
  }))
