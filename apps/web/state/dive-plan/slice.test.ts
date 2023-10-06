import { createStore } from 'zustand/vanilla'

import { createDivePlanSlice } from "./slice";
import { DivePlanState, DivePlanLevel } from "@/state/dive-plan/types";
import {when} from "jest-when";

function divePlanBuilder () {
  const builder = {
    withAscentRate,
    withDescentRate,
    withLevels,
    withoutLevels,
    build
  }

  let divePlan: DivePlanState = {
    descentRate: 10,
    ascentRate: 9,
    diveLevelsMap: {},
    diveLevelsIdList: []
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
    divePlan.diveLevelsMap = levels
    divePlan.diveLevelsIdList = Object.keys(divePlan.diveLevelsMap)
    return builder
  }

  function withoutLevels () {
    divePlan.diveLevelsMap = {}
    divePlan.diveLevelsIdList = []
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

    expect(sliceStore.getState().diveLevelsMap).toStrictEqual({ 'an-id': aDiveLevel })
    expect(sliceStore.getState().diveLevelsIdList).toStrictEqual(['an-id'])
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

    expect(sliceStore.getState().diveLevelsMap).toStrictEqual({
      'an-id': aDiveLevel,
      'another-id': anotherDiveLevel
    })
    expect(sliceStore.getState().diveLevelsIdList).toStrictEqual(['an-id', 'another-id'])
  })
});

describe('updateDiveLevel', () => {
  it('updates all the properties of a dive level', () => {
    const aDiveLevel: DivePlanLevel = {
      depth: 10,
      duration: 10,
      gasMix: { fO2: .21, fHe: 0 }
    }
    const aNewDiveLevel: DivePlanLevel = {
      depth: 20,
      duration: 30,
      gasMix: { fO2: .30, fHe: .1 }
    }
    const initialDivePlan =
      divePlanBuilder()
        .withLevels({ 'an-id': aDiveLevel })
        .build()
    const sliceStore = createStore(
      createDivePlanSlice({ initialDivePlan })
    )

    sliceStore.getState().updateDiveLevel("an-id", aNewDiveLevel)

    expect(sliceStore.getState().diveLevelsMap).toStrictEqual({
      'an-id': aNewDiveLevel
    })
    expect(sliceStore.getState().diveLevelsIdList).toStrictEqual(['an-id'])
  })

  it('updates a single the property of a dive level', () => {
    const aDiveLevel: DivePlanLevel = {
      depth: 10,
      duration: 10,
      gasMix: { fO2: .21, fHe: 0 }
    }
    const aNewDiveLevel: DivePlanLevel = {
      ...aDiveLevel,
      depth: 20
    }
    const initialDivePlan =
      divePlanBuilder()
        .withLevels({ 'an-id': aDiveLevel })
        .build()
    const sliceStore = createStore(
      createDivePlanSlice({ initialDivePlan })
    )

    sliceStore.getState().updateDiveLevel("an-id", { depth: 20 })

    expect(sliceStore.getState().diveLevelsMap).toStrictEqual({
      'an-id': aNewDiveLevel
    })
    expect(sliceStore.getState().diveLevelsIdList).toStrictEqual(['an-id'])
  })

  it('does nothing if the provided id is not defined', () => {
    const aDiveLevel: DivePlanLevel = {
      depth: 10,
      duration: 10,
      gasMix: { fO2: .21, fHe: 0 }
    }
    const aNewDiveLevel: DivePlanLevel = {
      depth: 20,
      duration: 30,
      gasMix: { fO2: .30, fHe: .1 }
    }
    const initialDivePlan =
      divePlanBuilder()
        .withLevels({ 'an-id': aDiveLevel })
        .build()
    const sliceStore = createStore(
      createDivePlanSlice({ initialDivePlan })
    )

    sliceStore.getState().updateDiveLevel("an-undefined-id", aNewDiveLevel)

    expect(sliceStore.getState().diveLevelsMap).toStrictEqual({
      'an-id': aDiveLevel
    })
    expect(sliceStore.getState().diveLevelsIdList).toStrictEqual(['an-id'])
  })
});

describe('removeDiveLevel', () => {
  it('removes a level by id', () => {
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

    expect(sliceStore.getState().diveLevelsMap).toStrictEqual({})
    expect(sliceStore.getState().diveLevelsIdList).toStrictEqual([])
  })

  it('does nothing when attempting to delete a level from an empty list', () => {
    const initialDivePlan = divePlanBuilder()
      .withoutLevels()
      .build()
    const sliceStore = createStore(
      createDivePlanSlice({ initialDivePlan })
    )

    sliceStore.getState().removeDiveLevel('a-undefined-id')

    expect(sliceStore.getState()).toMatchObject({
      diveLevelsMap: {},
      diveLevelsIdList: []
    })
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

    expect(sliceStore.getState().diveLevelsMap).toStrictEqual({ 'an-id': aDiveLevel })
    expect(sliceStore.getState().diveLevelsIdList).toStrictEqual(['an-id'])
    expect(sliceStore.getState()).toMatchObject({
      diveLevelsMap: { 'an-id': aDiveLevel },
      diveLevelsIdList: ['an-id']
    })
  })
})
