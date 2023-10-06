import {createStore} from "zustand/vanilla";
import {createDiveGasesSlice} from "@/state/dive-gases/slice";
import {when} from "jest-when";
import {GasMix} from "@/utils/types";
import {GasesState} from "@/state/dive-gases/types";

function gasesBuilder () {
  const builder = {
    withMixes,
    withoutMixes,
    build
  }

  let gases: GasesState = {
    mixesMap: {},
    mixesIdList: []
  }

  function withMixes (mixes: Record<string, GasMix>) {
    gases.mixesMap = mixes
    gases.mixesIdList = Object.keys(gases.mixesMap)
    return builder
  }

  function withoutMixes () {
    gases.mixesMap = {}
    gases.mixesIdList = []
    return builder
  }

  function build () {
    return gases
  }

  return builder
}


describe('addGasMix', () => {
  const generateUUID = jest.fn()

  it('adds a mix to an empty list', () => {
    const initialGases = gasesBuilder()
      .withoutMixes()
      .build()
    const aMix: GasMix = {
      fO2: 0.21,
      fHe: 0
    }
    const sliceStore = createStore(
      createDiveGasesSlice({ initialGases, generateUUID })
    )
    when(generateUUID).mockReturnValue('an-id')

    sliceStore.getState().addGasMix(aMix)

    expect(sliceStore.getState()).toMatchObject({
      mixesMap: { 'an-id': aMix },
      mixesIdList: ['an-id']
    })
  })

  it('adds a mix to the list', () => {
    const aMix: GasMix = {
      fO2: 0.21,
      fHe: 0
    }
    const anotherMix: GasMix = {
      fO2: 0.30,
      fHe: 0
    }
    const initialGases = gasesBuilder()
      .withMixes({
        'an-id': aMix
      })
      .build()
    const sliceStore = createStore(
      createDiveGasesSlice({ initialGases, generateUUID })
    )
    when(generateUUID).mockReturnValue('another-id')

    sliceStore.getState().addGasMix(anotherMix)

    expect(sliceStore.getState()).toMatchObject({
      mixesMap: {
        'an-id': aMix,
        'another-id': anotherMix
      },
      mixesIdList: ['an-id', 'another-id']
    })
  })
});

describe('updateGasMix', () => {
  it('updates all the properties of a mix', () => {
    const aMix: GasMix = {
      fO2: .21,
      fHe: 0
    }
    const aNewMix: GasMix = {
      fO2: .30,
      fHe: .70
    }
    const initialGases = gasesBuilder()
      .withMixes({
        'an-id': aMix
      })
      .build()
    const sliceStore = createStore(
      createDiveGasesSlice({ initialGases })
    )

    sliceStore.getState().updateGasMix("an-id", aNewMix)

    expect(sliceStore.getState()).toMatchObject({
      mixesMap: {
        'an-id': aNewMix
      },
      mixesIdList: ['an-id']
    })
  })

  it('updates a single the property of a mix', () => {
    const aMix: GasMix = {
      fO2: .21,
      fHe: 0
    }
    const aNewMix: GasMix = {
      ...aMix,
      fO2: .3
    }
    const initialGases = gasesBuilder()
      .withMixes({
        'an-id': aMix
      })
      .build()
    const sliceStore = createStore(
      createDiveGasesSlice({ initialGases })
    )

    sliceStore.getState().updateGasMix("an-id", { fO2: .3 })

    expect(sliceStore.getState()).toMatchObject({
      mixesMap: {
        'an-id': aNewMix
      },
      mixesIdList: ['an-id']
    })
  })

  it('does nothing if the provided id is not defined', () => {
    const aMix: GasMix = {
      fO2: .21,
      fHe: 0
    }
    const aNewMix: GasMix = {
      fO2: .30,
      fHe: .70
    }
    const initialGases = gasesBuilder()
      .withMixes({
        'an-id': aMix
      })
      .build()
    const sliceStore = createStore(
      createDiveGasesSlice({ initialGases })
    )

    sliceStore.getState().updateGasMix("an-undefined-id", aNewMix)

    expect(sliceStore.getState()).toMatchObject({
      mixesMap: {
        'an-id': aMix
      },
      mixesIdList: ['an-id']
    })
  })
});

describe('removeGasMix', () => {
  it('removes a mix by id', () => {
    const aMix: GasMix = {
      fO2: .21,
      fHe: 0
    }
    const initialGases = gasesBuilder()
      .withMixes({
        'an-id': aMix
      })
      .build()
    const sliceStore = createStore(
      createDiveGasesSlice({ initialGases })
    )

    sliceStore.getState().removeGasMix('an-id')

    expect(sliceStore.getState()).toMatchObject({
      mixesMap: {},
      mixesIdList: []
    })
  })

  it('does nothing when attempting to delete a mix from an empty list', () => {
    const initialGases = gasesBuilder()
      .withoutMixes()
      .build()
    const sliceStore = createStore(
      createDiveGasesSlice({ initialGases })
    )

    sliceStore.getState().removeGasMix('a-undefined-id')

    expect(sliceStore.getState()).toMatchObject({
      mixesMap: {},
      mixesIdList: []
    })
  })

  it('does nothing when attempting to delete a undefined id', () => {
    const aMix: GasMix = {
      fO2: .21,
      fHe: 0
    }
    const initialGases = gasesBuilder()
      .withMixes({
        'an-id': aMix
      })
      .build()
    const sliceStore = createStore(
      createDiveGasesSlice({ initialGases })
    )

    sliceStore.getState().removeGasMix('a-undefined-id')

    expect(sliceStore.getState()).toMatchObject({
      mixesMap: { 'an-id': aMix },
      mixesIdList: ['an-id']
    })
  })
})
