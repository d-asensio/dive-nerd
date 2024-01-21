import {when} from "jest-when"

import {Gas, GasType} from "@/utils/types";
import {createGasFormatter} from "@/utils/gas-formatter";
import {gasBuilder} from "@/model-builders/gas-builder";

describe('createGasFormatter.format', () => {
  it('labels nitrox with its O2 percentage', () => {
    const gas: Gas = gasBuilder()
      .withFractions({ fO2: .32, fHe: .0 })
      .build()
    const gasNameResolver = {
      resolve: jest.fn()
    }
    const gasFormatter = createGasFormatter({ gasNameResolver })
    when(gasNameResolver.resolve)
      .calledWith(gas)
      .mockReturnValue(GasType.NITROX)

    const result = gasFormatter.format(gas)

    expect(result).toBe("Nitrox 32")
  })

  it('does not label air with the O2 percentage', () => {
    const gas: Gas = gasBuilder()
      .withFractions({ fO2: .21, fHe: .0 })
      .build()
    const gasNameResolver = {
      resolve: jest.fn()
    }
    const gasFormatter = createGasFormatter({ gasNameResolver })
    when(gasNameResolver.resolve)
      .calledWith(gas)
      .mockReturnValue(GasType.AIR)

    const result = gasFormatter.format(gas)

    expect(result).toBe("Air")
  })

  it('does not label oxygen with the O2 percentage', () => {
    const gas: Gas = gasBuilder()
      .withFractions({ fO2: .99, fHe: .0 })
      .build()
    const gasNameResolver = {
      resolve: jest.fn()
    }
    const gasFormatter = createGasFormatter({ gasNameResolver })
    when(gasNameResolver.resolve)
      .calledWith(gas)
      .mockReturnValue(GasType.OXYGEN)

    const result = gasFormatter.format(gas)

    expect(result).toBe("Oxygen")
  })

  it('formats impossible mixes', () => {
    const gas: Gas = gasBuilder()
      .withFractions({ fO2: .99, fHe: .0 })
      .build()
    const gasNameResolver = {
      resolve: jest.fn()
    }
    const gasFormatter = createGasFormatter({ gasNameResolver })
    when(gasNameResolver.resolve)
      .calledWith(gas)
      .mockReturnValue(GasType.IMPOSSIBLE_MIX)

    const result = gasFormatter.format(gas)

    expect(result).toBe("Impossible Mix")
  })

  it.each([
    {
      gas: gasBuilder()
        .withFractions({ fO2: .28, fHe: 0 })
        .build(),
      gasName: GasType.NITROX,
      expectedResult: "Nitrox 28"
    },
    {
      gas: gasBuilder()
        .withFractions({ fO2: .21, fHe: .1 })
        .build(),
      gasName: GasType.HELITROX,
      expectedResult: "Helitrox 21/10"
    },
    {
      gas: gasBuilder()
        .withFractions({ fO2: .28, fHe: .07 })
        .build(),
      gasName: GasType.HELITROX,
      expectedResult: "Helitrox 28/7"
    },
    {
      gas: gasBuilder()
        .withFractions({ fO2: .18, fHe: .1 })
        .build(),
      gasName: GasType.TRIMIX,
      expectedResult: "Trimix 18/10"
    },
    {
      gas: gasBuilder()
        .withFractions({ fO2: .20, fHe: .80 })
        .build(),
      gasName: GasType.HELIOX,
      expectedResult: "Heliox 20/80"
    }
  ])('labels $gasName mixes with (O2: $gas.fO2, He: $gas.fHe)', ({ gas, gasName, expectedResult }) => {
    const gasNameResolver = {
      resolve: jest.fn()
    }
    const gasFormatter = createGasFormatter({ gasNameResolver })
    when(gasNameResolver.resolve)
      .calledWith(gas)
      .mockReturnValue(gasName)

    const result = gasFormatter.format(gas)

    expect(result).toBe(expectedResult)
  })
})
