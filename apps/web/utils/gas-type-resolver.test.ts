import { gasTypeResolver } from "@/utils/gas-type-resolver";
import {GasType} from "@/utils/types";

it.each([
  {
    gas: { fO2: .21, fHe: 0 },
    expectedResult: GasType.AIR
  },
  {
    gas: { fO2: .22, fHe: 0 },
    expectedResult: GasType.NITROX
  },
  {
    gas: { fO2: .50, fHe: 0 },
    expectedResult: GasType.NITROX
  },
  {
    gas: { fO2: .92, fHe: 0 },
    expectedResult: GasType.NITROX
  },
  {
    gas: { fO2: .93, fHe: 0 },
    expectedResult: GasType.OXYGEN
  },
  {
    gas: { fO2: 1, fHe: 0 },
    expectedResult: GasType.OXYGEN
  },
  {
    gas: { fO2: .21, fHe: .1 },
    expectedResult: GasType.HELITROX
  },
  {
    gas: { fO2: .19, fHe: .1 },
    expectedResult: GasType.HELITROX
  },
  {
    gas: { fO2: .18, fHe: .1 },
    expectedResult: GasType.TRIMIX
  },
  {
    gas: { fO2: .20, fHe: .80 },
    expectedResult: GasType.HELIOX
  },
  {
    gas: { fO2: .30, fHe: .70 },
    expectedResult: GasType.HELIOX
  },
  {
    gas: { fO2: 1, fHe: .7 },
    expectedResult: GasType.IMPOSSIBLE_MIX
  }
])('identifies (O2: $gas.fO2, He: $gas.fHe) as $expectedResult', ({ gas, expectedResult }) => {
  const result = gasTypeResolver.resolve(gas)

  expect(result).toBe(expectedResult)
})
