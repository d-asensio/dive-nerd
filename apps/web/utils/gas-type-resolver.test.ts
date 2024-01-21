import { gasTypeResolver } from "@/utils/gas-type-resolver";
import {GasType} from "@/utils/types";
import {gasBuilder} from "@/model-builders/gas-builder";

it.each([
  {
    gas: gasBuilder()
      .withFractions({ fO2: .21, fHe: 0 })
      .build(),
    expectedResult: GasType.AIR
  },
  {
    gas: gasBuilder()
      .withFractions({ fO2: .22, fHe: 0 })
      .build(),
    expectedResult: GasType.NITROX
  },
  {
    gas: gasBuilder()
      .withFractions({ fO2: .20, fHe: 0 })
      .build(),
    expectedResult: GasType.NITROX
  },
  {
    gas: gasBuilder()
      .withFractions({ fO2: .50, fHe: 0 })
      .build(),
    expectedResult: GasType.NITROX
  },
  {
    gas: gasBuilder()
      .withFractions({ fO2: .92, fHe: 0 })
      .build(),
    expectedResult: GasType.NITROX
  },
  {
    gas: gasBuilder()
      .withFractions({ fO2: .93, fHe: 0 })
      .build(),
    expectedResult: GasType.OXYGEN
  },
  {
    gas: gasBuilder()
      .withFractions({ fO2: 1, fHe: 0 })
      .build(),
    expectedResult: GasType.OXYGEN
  },
  {
    gas: gasBuilder()
      .withFractions({ fO2: .21, fHe: .1 })
      .build(),
    expectedResult: GasType.HELITROX
  },
  {
    gas: gasBuilder()
      .withFractions({ fO2: .19, fHe: .1 })
      .build(),
    expectedResult: GasType.HELITROX
  },
  {
    gas: gasBuilder()
      .withFractions({ fO2: .18, fHe: .1 })
      .build(),
    expectedResult: GasType.TRIMIX
  },
  {
    gas: gasBuilder()
      .withFractions({ fO2: .20, fHe: .80 })
      .build(),
    expectedResult: GasType.HELIOX
  },
  {
    gas: gasBuilder()
      .withFractions({ fO2: .30, fHe: .70 })
      .build(),
    expectedResult: GasType.HELIOX
  },
  {
    gas: gasBuilder()
      .withFractions({ fO2: 1, fHe: .7 })
      .build(),
    expectedResult: GasType.IMPOSSIBLE_MIX
  }
])('identifies (O2: $gas.fO2, He: $gas.fHe) as $expectedResult', ({ gas, expectedResult }) => {
  const result = gasTypeResolver.resolve(gas)

  expect(result).toBe(expectedResult)
})
