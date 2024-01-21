import {createStore} from "zustand/vanilla";
import {createDiveGasesSlice} from "@/state/dive-gases/slice";
import {when} from "jest-when";
import {Gas} from "@/utils/types";
import {diveGasesBuilder} from "@/model-builders/dive-gases-builder";
import {gasBuilder} from "@/model-builders/gas-builder";


describe('addGas', () => {
  const generateUUID = jest.fn()

  it('adds a gas to an empty list', () => {
    const initialGases = diveGasesBuilder()
      .withoutGases()
      .build()
    const aGas: Gas = gasBuilder()
      .withFractions({
        fO2: 0.21,
        fHe: 0
      })
      .build()
    const sliceStore = createStore(
      createDiveGasesSlice({ initialGases, generateUUID })
    )
    when(generateUUID).mockReturnValue('an-id')

    sliceStore.getState().addGas(aGas)

    expect(sliceStore.getState()).toMatchObject({
      gasesMap: { 'an-id': aGas },
      gasesIdList: ['an-id']
    })
  })

  it('adds a gas to the list', () => {
    const aGas: Gas = gasBuilder()
      .withFractions({
        fO2: 0.21,
        fHe: 0
      })
      .build()
    const anotherGas: Gas = gasBuilder()
      .withFractions({
        fO2: 0.30,
        fHe: 0
      })
      .build()
    const initialGases = diveGasesBuilder()
      .withGases({
        'an-id': aGas
      })
      .build()
    const sliceStore = createStore(
      createDiveGasesSlice({ initialGases, generateUUID })
    )
    when(generateUUID).mockReturnValue('another-id')

    sliceStore.getState().addGas(anotherGas)

    expect(sliceStore.getState()).toMatchObject({
      gasesMap: {
        'an-id': aGas,
        'another-id': anotherGas
      },
      gasesIdList: ['an-id', 'another-id']
    })
  })
});

describe('updateGas', () => {
  it('updates all the properties of a mix', () => {
    const aGas: Gas = gasBuilder()
      .withFractions({
        fO2: .21,
        fHe: 0
      })
      .build()
    const aNewGas: Gas = gasBuilder()
      .withFractions({
        fO2: .30,
        fHe: .70
      })
      .build()
    const initialGases = diveGasesBuilder()
      .withGases({
        'an-id': aGas
      })
      .build()
    const sliceStore = createStore(
      createDiveGasesSlice({ initialGases })
    )

    sliceStore.getState().updateGas("an-id", aNewGas)

    expect(sliceStore.getState()).toMatchObject({
      gasesMap: {
        'an-id': aNewGas
      },
      gasesIdList: ['an-id']
    })
  })

  it('updates a single the property of a mix', () => {
    const aGas: Gas = gasBuilder()
      .withFractions({
        fO2: .21,
        fHe: 0
      })
      .build()
    const expectedGas: Gas = gasBuilder()
      .withFractions({
        fO2: .3,
        fHe: 0
      })
      .build()
    const initialGases = diveGasesBuilder()
      .withGases({
        'an-id': aGas
      })
      .build()
    const sliceStore = createStore(
      createDiveGasesSlice({ initialGases })
    )

    sliceStore.getState().updateGas("an-id", { fO2: .3 })

    expect(sliceStore.getState()).toMatchObject({
      gasesMap: {
        'an-id': expectedGas
      },
      gasesIdList: ['an-id']
    })
  })

  it('does nothing if the provided id is not defined', () => {
    const aGas: Gas = gasBuilder()
      .withFractions({
        fO2: .21,
        fHe: 0
      })
      .build()
    const aNewGas: Gas = gasBuilder()
      .withFractions({
        fO2: .30,
        fHe: .70
      })
      .build()
    const initialGases = diveGasesBuilder()
      .withGases({
        'an-id': aGas
      })
      .build()
    const sliceStore = createStore(
      createDiveGasesSlice({ initialGases })
    )

    sliceStore.getState().updateGas("an-undefined-id", aNewGas)

    expect(sliceStore.getState()).toMatchObject({
      gasesMap: {
        'an-id': aGas
      },
      gasesIdList: ['an-id']
    })
  })
});

describe('removeGas', () => {
  it('removes a mix by id', () => {
    const aGas: Gas = gasBuilder()
      .withFractions({
        fO2: .21,
        fHe: 0
      })
      .build()
    const initialGases = diveGasesBuilder()
      .withGases({
        'an-id': aGas
      })
      .build()
    const sliceStore = createStore(
      createDiveGasesSlice({ initialGases })
    )

    sliceStore.getState().removeGas('an-id')

    expect(sliceStore.getState()).toMatchObject({
      gasesMap: {},
      gasesIdList: []
    })
  })

  it('does nothing when attempting to delete a mix from an empty list', () => {
    const initialGases = diveGasesBuilder()
      .withoutGases()
      .build()
    const sliceStore = createStore(
      createDiveGasesSlice({ initialGases })
    )

    sliceStore.getState().removeGas('a-undefined-id')

    expect(sliceStore.getState()).toMatchObject({
      gasesMap: {},
      gasesIdList: []
    })
  })

  it('does nothing when attempting to delete a undefined id', () => {
    const aGas: Gas = gasBuilder()
      .withFractions({
        fO2: .21,
        fHe: 0
      })
      .build()
    const initialGases = diveGasesBuilder()
      .withGases({
        'an-id': aGas
      })
      .build()
    const sliceStore = createStore(
      createDiveGasesSlice({ initialGases })
    )

    sliceStore.getState().removeGas('a-undefined-id')

    expect(sliceStore.getState()).toMatchObject({
      gasesMap: { 'an-id': aGas },
      gasesIdList: ['an-id']
    })
  })
})
