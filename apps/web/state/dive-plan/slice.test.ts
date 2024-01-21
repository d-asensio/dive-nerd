import {createStore} from 'zustand/vanilla'

import {createDivePlanSlice} from "./slice";
import {DivePlanLevel} from "@/state/dive-plan/types";
import {divePlanBuilder} from "@/model-builders/dive-plan-builder";

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
  it('adds a level to an empty levels list', () => {
    const initialDivePlan = divePlanBuilder()
      .withoutLevels()
      .build()
    const aDiveLevel: DivePlanLevel = {
      depth: 20,
      duration: 30,
      gasId: 'a-gas-id'
    }
    const sliceStore = createStore(
      createDivePlanSlice({ initialDivePlan })
    )

    sliceStore.getState().addDiveLevel('an-id', aDiveLevel)

    expect(sliceStore.getState()).toMatchObject({
      diveLevelsMap: { 'an-id': aDiveLevel },
      diveLevelsIdList: ['an-id']
    })
  })

  it('adds a level to levels list', () => {
    const aDiveLevel: DivePlanLevel = {
      depth: 10,
      duration: 10,
      gasId: 'a-gas-id'
    }
    const anotherDiveLevel: DivePlanLevel = {
      depth: 20,
      duration: 30,
      gasId: 'a-gas-id'
    }
    const initialDivePlan =
      divePlanBuilder()
        .withLevels({ 'an-id': aDiveLevel })
        .build()
    const sliceStore = createStore(
      createDivePlanSlice({ initialDivePlan })
    )

    sliceStore.getState().addDiveLevel('another-id', anotherDiveLevel)

    expect(sliceStore.getState()).toMatchObject({
      diveLevelsMap: {
        'an-id': aDiveLevel,
        'another-id': anotherDiveLevel
      },
      diveLevelsIdList: ['an-id', 'another-id']
    })
  })
});

describe('updateDiveLevel', () => {
  it('updates all the properties of a dive level', () => {
    const aDiveLevel: DivePlanLevel = {
      depth: 10,
      duration: 10,
      gasId: 'a-gas-id'
    }
    const aNewDiveLevel: DivePlanLevel = {
      depth: 20,
      duration: 30,
      gasId: 'a-gas-id'
    }
    const initialDivePlan =
      divePlanBuilder()
        .withLevels({ 'an-id': aDiveLevel })
        .build()
    const sliceStore = createStore(
      createDivePlanSlice({ initialDivePlan })
    )

    sliceStore.getState().updateDiveLevel("an-id", aNewDiveLevel)

    expect(sliceStore.getState()).toMatchObject({
      diveLevelsMap: { 'an-id': aNewDiveLevel },
      diveLevelsIdList: ['an-id']
    })
  })

  it('updates a single the property of a dive level', () => {
    const aDiveLevel: DivePlanLevel = {
      depth: 10,
      duration: 10,
      gasId: 'a-gas-id'
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

    expect(sliceStore.getState()).toMatchObject({
      diveLevelsMap: { 'an-id': aNewDiveLevel },
      diveLevelsIdList: ['an-id']
    })
  })

  it('does nothing if the provided id is not defined', () => {
    const aDiveLevel: DivePlanLevel = {
      depth: 10,
      duration: 10,
      gasId: 'a-gas-id'
    }
    const aNewDiveLevel: DivePlanLevel = {
      depth: 20,
      duration: 30,
      gasId: 'a-gas-id'
    }
    const initialDivePlan =
      divePlanBuilder()
        .withLevels({ 'an-id': aDiveLevel })
        .build()
    const sliceStore = createStore(
      createDivePlanSlice({ initialDivePlan })
    )

    sliceStore.getState().updateDiveLevel("an-undefined-id", aNewDiveLevel)

    expect(sliceStore.getState()).toMatchObject({
      diveLevelsMap: { 'an-id': aDiveLevel },
      diveLevelsIdList: ['an-id']
    })
  })
});

describe('removeDiveLevel', () => {
  it('removes a level by id', () => {
    const aDiveLevel: DivePlanLevel = {
      depth: 20,
      duration: 30,
      gasId: 'a-gas-id'
    }
    const initialDivePlan =
      divePlanBuilder()
        .withLevels({ 'an-id': aDiveLevel })
        .build()
    const sliceStore = createStore(
      createDivePlanSlice({ initialDivePlan })
    )

    sliceStore.getState().removeDiveLevel('an-id')

    expect(sliceStore.getState()).toMatchObject({
      diveLevelsMap: {},
      diveLevelsIdList: []
    })
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
      gasId: 'a-gas-id'
    }
    const initialDivePlan =
      divePlanBuilder()
        .withLevels({ 'an-id': aDiveLevel })
        .build()
    const sliceStore = createStore(
      createDivePlanSlice({ initialDivePlan })
    )

    sliceStore.getState().removeDiveLevel('a-undefined-id')

    expect(sliceStore.getState()).toMatchObject({
      diveLevelsMap: { 'an-id': aDiveLevel },
      diveLevelsIdList: ['an-id']
    })
  })
})
