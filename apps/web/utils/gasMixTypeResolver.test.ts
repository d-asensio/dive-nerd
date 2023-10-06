import { gasMixTypeResolver } from "@/utils/gasMixTypeResolver";
import {GasMixType} from "@/utils/types";

it.each([
  {
    gasMix: { fO2: .21, fHe: 0 },
    expectedResult: GasMixType.AIR
  },
  {
    gasMix: { fO2: .22, fHe: 0 },
    expectedResult: GasMixType.NITROX
  },
  {
    gasMix: { fO2: .50, fHe: 0 },
    expectedResult: GasMixType.NITROX
  },
  {
    gasMix: { fO2: .92, fHe: 0 },
    expectedResult: GasMixType.NITROX
  },
  {
    gasMix: { fO2: .93, fHe: 0 },
    expectedResult: GasMixType.OXYGEN
  },
  {
    gasMix: { fO2: 1, fHe: 0 },
    expectedResult: GasMixType.OXYGEN
  },
  {
    gasMix: { fO2: .21, fHe: .1 },
    expectedResult: GasMixType.HELITROX
  },
  {
    gasMix: { fO2: .19, fHe: .1 },
    expectedResult: GasMixType.HELITROX
  },
  {
    gasMix: { fO2: .18, fHe: .1 },
    expectedResult: GasMixType.TRIMIX
  },
  {
    gasMix: { fO2: .20, fHe: .80 },
    expectedResult: GasMixType.HELIOX
  },
  {
    gasMix: { fO2: .30, fHe: .70 },
    expectedResult: GasMixType.HELIOX
  }
])('identifies (O2: $gasMix.fO2, He: $gasMix.fHe) as $expectedResult', ({ gasMix, expectedResult }) => {
  const result = gasMixTypeResolver.resolve(gasMix)

  expect(result).toBe(expectedResult)
})
