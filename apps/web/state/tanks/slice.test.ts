import {createStore} from 'zustand/vanilla'

import {createTanksSlice} from "./slice"
import {Tank} from "@/state/tanks/types"

const someTank = (overrides: Partial<Tank> = {}): Tank => ({
  modelId: 'AL80',
  gasId: 'a-gas-id',
  pressure: 200,
  ...overrides,
})

it('initialises with no tanks', () => {
  const store = createStore(createTanksSlice({ initialTanks: { tanksMap: {}, tanksIdList: [] } }))
  expect(store.getState()).toMatchObject({ tanksMap: {}, tanksIdList: [] })
})

describe('addTank', () => {
  it('appends a tank to the empty list', () => {
    const store = createStore(createTanksSlice({ initialTanks: { tanksMap: {}, tanksIdList: [] } }))
    const tank = someTank()

    store.getState().addTank('tank-1', tank)

    expect(store.getState()).toMatchObject({
      tanksMap: { 'tank-1': tank },
      tanksIdList: ['tank-1'],
    })
  })

  it('appends to an existing list preserving order', () => {
    const first = someTank()
    const store = createStore(createTanksSlice({
      initialTanks: { tanksMap: { 'tank-1': first }, tanksIdList: ['tank-1'] },
    }))

    store.getState().addTank('tank-2', someTank({ modelId: 'AL40' }))

    expect(store.getState().tanksIdList).toEqual(['tank-1', 'tank-2'])
  })
})

describe('updateTank', () => {
  it('updates a single property without touching the rest', () => {
    const original = someTank({ pressure: 200 })
    const store = createStore(createTanksSlice({
      initialTanks: { tanksMap: { 'tank-1': original }, tanksIdList: ['tank-1'] },
    }))

    store.getState().updateTank('tank-1', { pressure: 232 })

    expect(store.getState().tanksMap['tank-1']).toEqual({ ...original, pressure: 232 })
  })

  it('does nothing for an unknown id', () => {
    const original = someTank()
    const store = createStore(createTanksSlice({
      initialTanks: { tanksMap: { 'tank-1': original }, tanksIdList: ['tank-1'] },
    }))

    store.getState().updateTank('does-not-exist', { pressure: 0 })

    expect(store.getState().tanksMap).toEqual({ 'tank-1': original })
  })
})

describe('removeTank', () => {
  it('removes the tank from both the map and the id list', () => {
    const store = createStore(createTanksSlice({
      initialTanks: {
        tanksMap: { 'tank-1': someTank(), 'tank-2': someTank({ modelId: 'AL40' }) },
        tanksIdList: ['tank-1', 'tank-2'],
      },
    }))

    store.getState().removeTank('tank-1')

    expect(store.getState()).toMatchObject({
      tanksMap: { 'tank-2': someTank({ modelId: 'AL40' }) },
      tanksIdList: ['tank-2'],
    })
  })
})
