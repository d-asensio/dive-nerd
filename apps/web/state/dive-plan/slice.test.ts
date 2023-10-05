import { createStore } from 'zustand/vanilla'

import { createDivePlanSlice } from "./slice";
import { DivePlan, DivePlanLevel } from "@/state/dive-plan/types";

function divePlanBuilder () {
  const builder = {
    withAscentRate,
    withDescentRate,
    withLevels,
    build
  }

  let divePlan: DivePlan = {
    descentRate: 10,
    ascentRate: 9,
    diveLevels: []
  }

  function withDescentRate (descentRate: number) {
    divePlan.descentRate = descentRate
    return builder
  }

  function withAscentRate (ascentRate: number) {
    divePlan.ascentRate = ascentRate
    return builder
  }

  function withLevels (levels: DivePlanLevel[]) {
    divePlan.diveLevels = levels
    return builder
  }

  function build () {
    return divePlan
  }

  return builder
}

it('initializes state', () => {
  const initialDivePlan = divePlanBuilder().build()
  const slice = createStore(
    createDivePlanSlice(initialDivePlan)
  )

  const state = slice.getState()

  expect(state).toMatchObject(initialDivePlan)
})

describe('setAscentRate', () => {
  it('sets an ascent rate', () => {
    const slice = createStore(
      createDivePlanSlice(
        divePlanBuilder()
          .withAscentRate(0)
          .build()
      )
    )

    slice.getState().setAscentRate(99)

    expect(slice.getState().ascentRate).toBe(99)
  })
})

describe('setDescentRate', () => {
  it('sets a descent rate', () => {
    const slice = createStore(
      createDivePlanSlice(
        divePlanBuilder()
          .withDescentRate(0)
          .build()
      )
    )

    slice.getState().setDescentRate(99)

    expect(slice.getState().descentRate).toBe(99)
  })
})

describe('addDiveLevel', () => {
  it('adds a level to an empty levels list', () => {
    const slice = createStore(
      createDivePlanSlice(
        divePlanBuilder()
          .withLevels([])
          .build()
      )
    )
    const diveLevel: DivePlanLevel = {
      depth: 20,
      duration: 30,
      gas: {
        fractionO2: 0.21,
        fractionHe: 0
      }
    }

    slice.getState().addDiveLevel(diveLevel)

    expect(slice.getState().diveLevels).toStrictEqual([
      diveLevel
    ])
  })

  it('adds a level to levels list', () => {
    const aDiveLevel: DivePlanLevel = {
      depth: 10,
      duration: 10,
      gas: {
        fractionO2: 0.21,
        fractionHe: 0
      }
    }
    const anotherDiveLevel: DivePlanLevel = {
      depth: 20,
      duration: 30,
      gas: {
        fractionO2: 0.21,
        fractionHe: 0
      }
    }
    const slice = createStore(
      createDivePlanSlice(
        divePlanBuilder()
          .withLevels([aDiveLevel])
          .build()
      )
    )

    slice.getState().addDiveLevel(anotherDiveLevel)

    expect(slice.getState().diveLevels).toStrictEqual([
      aDiveLevel,
      anotherDiveLevel
    ])
  })
});

describe('removeDiveLevel', () => {
  it('removes a level by index', () => {
    const aDiveLevel: DivePlanLevel = {
      depth: 20,
      duration: 30,
      gas: {
        fractionO2: 0.21,
        fractionHe: 0
      }
    }
    const slice = createStore(
      createDivePlanSlice(
        divePlanBuilder()
          .withLevels([aDiveLevel])
          .build()
      )
    )

    slice.getState().removeDiveLevel(0)

    expect(slice.getState().diveLevels).toStrictEqual([])
  })

  it('does nothing when attempting to delete a level from an empty list', () => {
    const slice = createStore(
      createDivePlanSlice(
        divePlanBuilder()
          .withLevels([])
          .build()
      )
    )

    slice.getState().removeDiveLevel(0)

    expect(slice.getState().diveLevels).toStrictEqual([])
  })

  it('does nothing when attempting to delete a undefined index', () => {
    const aDiveLevel: DivePlanLevel = {
      depth: 20,
      duration: 30,
      gas: {
        fractionO2: 0.21,
        fractionHe: 0
      }
    }
    const slice = createStore(
      createDivePlanSlice(
        divePlanBuilder()
          .withLevels([aDiveLevel])
          .build()
      )
    )

    slice.getState().removeDiveLevel(1)

    expect(slice.getState().diveLevels).toStrictEqual([aDiveLevel])
  })
})
