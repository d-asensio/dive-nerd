import { createDepthPressureConverter } from './depth-pressure-conversion'
import { createGasSwitchDepthCalculator } from './gas-switch-depths'
import { Gas } from './types'

const environment = {
  surfaceAmbientPressure: 1.0133,
  waterDensity: 1023.6,
  waterVaporPressure: 0.0567
}

const ean50: Gas = { fO2: 0.5, fHe: 0, isDecoGas: true }
const oxygen: Gas = { fO2: 1, fHe: 0, isDecoGas: true }
const ean32: Gas = { fO2: 0.32, fHe: 0, isDecoGas: true }
const air: Gas = { fO2: 0.21, fHe: 0, isDecoGas: false }

describe('createGasSwitchDepthCalculator', () => {
  const depthPressureConverter = createDepthPressureConverter(environment)
  const { switchDepthOf, switchDepthsOf } = createGasSwitchDepthCalculator({
    depthPressureConverter
  })

  test.each([
    { name: 'EAN50', gas: ean50, expected: 21 },
    { name: 'O2',    gas: oxygen, expected: 6 },
    // EAN32 marked as a deco gas uses ppO2Max = 1.6 → MOD ≈ 39.7 m → 39 m on grid.
    // (The ppO2 = 1.4 bottom-gas convention used in the web UI would give 33 m.)
    { name: 'EAN32', gas: ean32, expected: 39 }
  ])('snaps the MOD of $name to a 3 m grid (expects $expected m)', ({ gas, expected }) => {
    expect(switchDepthOf(gas)).toBe(expected)
  })

  it('only returns switch depths for deco gases', () => {
    expect(switchDepthsOf([air, ean50, oxygen])).toEqual([21, 6])
  })
})
