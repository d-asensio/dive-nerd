import {GasMixName, gasMixName} from "@/utils/gasMixName";

it.each([
  {
    gasMix: { fO2: .21, fHe: 0 },
    expectedResult: GasMixName.AIR
  },
  {
    gasMix: { fO2: .22, fHe: 0 },
    expectedResult: GasMixName.NITROX
  },
  {
    gasMix: { fO2: .50, fHe: 0 },
    expectedResult: GasMixName.NITROX
  },
  {
    gasMix: { fO2: .92, fHe: 0 },
    expectedResult: GasMixName.NITROX
  },
  {
    gasMix: { fO2: .93, fHe: 0 },
    expectedResult: GasMixName.OXYGEN
  },
  {
    gasMix: { fO2: .21, fHe: .1 },
    expectedResult: GasMixName.HELITROX
  },
  {
    gasMix: { fO2: .19, fHe: .1 },
    expectedResult: GasMixName.HELITROX
  },
  {
    gasMix: { fO2: .18, fHe: .1 },
    expectedResult: GasMixName.TRIMIX
  },
  {
    gasMix: { fO2: .20, fHe: .80 },
    expectedResult: GasMixName.HELIOX
  },
  {
    gasMix: { fO2: .30, fHe: .70 },
    expectedResult: GasMixName.HELIOX
  }
])('identifies (O2: $gasMix.fO2, He: $gasMix.fHe) as $expectedResult', ({ gasMix, expectedResult }) => {
  const result = gasMixName(gasMix)

  expect(result).toBe(expectedResult)
})
