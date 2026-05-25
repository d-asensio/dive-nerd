import { createBestDecoGasSelector } from './best-deco-gas-selector'
import { Gas } from './types'

const backGas: Gas = { fO2: 0.21, fHe: 0, isDecoGas: false }
const ean50: Gas = { fO2: 0.5, fHe: 0, isDecoGas: true }
const oxygen: Gas = { fO2: 1, fHe: 0, isDecoGas: true }
const ean32: Gas = { fO2: 0.32, fHe: 0, isDecoGas: true }

describe('createBestDecoGasSelector', () => {
  const selector = createBestDecoGasSelector({ ppO2Max: 1.6 })

  it('returns the back gas when no deco gas is safe at the depth', () => {
    // At 4 bar (~30 msw) EAN50 ppO2 = 2.0 → unsafe, O2 ppO2 = 4.0 → unsafe
    const result = selector.select({
      availableGases: [ean50, oxygen],
      backGas,
      ambientPressure: 4
    })

    expect(result).toBe(backGas)
  })

  it('picks the richest safe deco gas (EAN50 at 21 m, not O2)', () => {
    // At ~2.8 bar (21 msw): EAN50 ppO2 = 1.4 (safe), O2 ppO2 = 2.8 (unsafe)
    const result = selector.select({
      availableGases: [ean50, oxygen, ean32],
      backGas,
      ambientPressure: 2.8
    })

    expect(result).toBe(ean50)
  })

  it('picks oxygen at the 6 m stop where every deco gas is safe', () => {
    // At ~1.6 bar (6 msw) every deco gas is within ppO2Max
    const result = selector.select({
      availableGases: [ean50, oxygen, ean32],
      backGas,
      ambientPressure: 1.6
    })

    expect(result).toBe(oxygen)
  })

  it('ignores gases not marked as deco gases', () => {
    const richBackGas: Gas = { fO2: 0.6, fHe: 0, isDecoGas: false }

    const result = selector.select({
      availableGases: [richBackGas],
      backGas,
      ambientPressure: 1.6
    })

    expect(result).toBe(backGas)
  })
})
