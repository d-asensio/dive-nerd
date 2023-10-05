import { createStore } from 'zustand/vanilla'

import { createDivePlanSlice } from "./slice";
import { DivePlan, DivePlanLevel } from "@/state/dive-plan/types";
import {when} from "jest-when";

function divePlanBuilder () {
  const builder = {
    withAscentRate,
    withDescentRate,
    withLevels,
    withoutLevels,
    build
  }

  let divePlan: DivePlan = {
    descentRate: 10,
    ascentRate: 9,
    diveLevels: {}
  }

  function withDescentRate (descentRate: number) {
    divePlan.descentRate = descentRate
    return builder
  }

  function withAscentRate (ascentRate: number) {
    divePlan.ascentRate = ascentRate
    return builder
  }

  function withLevels (levels: Record<string, DivePlanLevel>) {
    divePlan.diveLevels = levels
    return builder
  }

  function withoutLevels () {
    divePlan.diveLevels = {}
    return builder
  }

  function build () {
    return divePlan
  }

  return builder
}

it('initializes state', () => {
  const initialDivePlan = divePlanBuilder().build()
  const sliceStore = createStore(
    createDivePlanSlice({ initialDivePlan })
  )

  const state = sliceStore.getState()

  expect(state).toMatchObject(initialDivePlan)
})

describe('setAscentRate', () => {
  it('sets an ascent rate', () => {
    const initialDivePlan =
      divePlanBuilder()
        .withAscentRate(0)
        .build()
    const sliceStore = createStore(
      createDivePlanSlice({ initialDivePlan })
    )

    sliceStore.getState().setAscentRate(99)

    expect(sliceStore.getState().ascentRate).toBe(99)
  })
})

describe('setDescentRate', () => {
  it('sets a descent rate', () => {
    const initialDivePlan =
      divePlanBuilder()
        .withDescentRate(0)
        .build()

    const sliceStore = createStore(
      createDivePlanSlice({ initialDivePlan })
    )

    sliceStore.getState().setDescentRate(99)

    expect(sliceStore.getState().descentRate).toBe(99)
  })
})

describe('addDiveLevel', () => {
  const generateUUID = jest.fn()

  it('adds a level to an empty levels list', () => {
    const initialDivePlan = divePlanBuilder()
      .withoutLevels()
      .build()
    const aDiveLevel: DivePlanLevel = {
      depth: 20,
      duration: 30,
      gasMix: {
        fO2: 0.21,
        fHe: 0
      }
    }
    const sliceStore = createStore(
      createDivePlanSlice({ initialDivePlan, generateUUID })
    )
    when(generateUUID).mockReturnValue('an-id')

    sliceStore.getState().addDiveLevel(aDiveLevel)

    expect(sliceStore.getState().diveLevels).toStrictEqual({
      'an-id': aDiveLevel
    })
  })

  it('adds a level to levels list', () => {
    const aDiveLevel: DivePlanLevel = {
      depth: 10,
      duration: 10,
      gasMix: {
        fO2: 0.21,
        fHe: 0
      }
    }
    const anotherDiveLevel: DivePlanLevel = {
      depth: 20,
      duration: 30,
      gasMix: {
        fO2: 0.21,
        fHe: 0
      }
    }
    const initialDivePlan =
      divePlanBuilder()
        .withLevels({ 'an-id': aDiveLevel })
        .build()
    const sliceStore = createStore(
      createDivePlanSlice({ initialDivePlan, generateUUID })
    )
    when(generateUUID).mockReturnValue('another-id')

    sliceStore.getState().addDiveLevel(anotherDiveLevel)

    expect(sliceStore.getState().diveLevels).toStrictEqual({
      'an-id': aDiveLevel,
      'another-id': anotherDiveLevel
    })
  })
});

describe('removeDiveLevel', () => {
  it('removes a level by index', () => {
    const aDiveLevel: DivePlanLevel = {
      depth: 20,
      duration: 30,
      gasMix: {
        fO2: 0.21,
        fHe: 0
      }
    }
    const initialDivePlan =
      divePlanBuilder()
        .withLevels({ 'an-id': aDiveLevel })
        .build()
    const sliceStore = createStore(
      createDivePlanSlice({ initialDivePlan })
    )

    sliceStore.getState().removeDiveLevel('an-id')

    expect(sliceStore.getState().diveLevels).toStrictEqual({})
  })

  it('does nothing when attempting to delete a level from an empty list', () => {
    const initialDivePlan = divePlanBuilder()
      .withoutLevels()
      .build()
    const sliceStore = createStore(
      createDivePlanSlice({ initialDivePlan })
    )

    sliceStore.getState().removeDiveLevel('a-undefined-id')

    expect(sliceStore.getState().diveLevels).toStrictEqual({})
  })

  it('does nothing when attempting to delete a undefined id', () => {
    const aDiveLevel: DivePlanLevel = {
      depth: 20,
      duration: 30,
      gasMix: {
        fO2: 0.21,
        fHe: 0
      }
    }
    const initialDivePlan =
      divePlanBuilder()
        .withLevels({ 'an-id': aDiveLevel })
        .build()
    const sliceStore = createStore(
      createDivePlanSlice({ initialDivePlan })
    )

    sliceStore.getState().removeDiveLevel('a-undefined-id')

    expect(sliceStore.getState().diveLevels).toStrictEqual({ 'an-id': aDiveLevel })
  })
})
