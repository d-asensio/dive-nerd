import { agencyGasPresets } from "@/utils/gas-presets";
import { Gas } from "@/utils/types";

const bottom = (fO2: number, fHe: number): Gas => ({ isDecoGas: false, fO2, fHe })
const deco = (fO2: number, fHe: number): Gas => ({ isDecoGas: true, fO2, fHe })

const presetFor = (agency: string) => {
  const preset = agencyGasPresets.find(p => p.agency === agency)
  if (!preset) throw new Error(`no preset for ${agency}`)
  return preset
}

it('exposes exactly the UTD, GUE and TDI agencies in order', () => {
  expect(agencyGasPresets.map(p => p.agency)).toEqual(['UTD', 'GUE', 'TDI'])
})

describe('UTD standard gases', () => {
  it('lists the UTD bottom and travel gases', () => {
    expect(presetFor('UTD').bottom).toEqual([
      bottom(0.21, 0),     // Air
      bottom(0.32, 0),     // Nitrox 32
      bottom(0.30, 0),     // Nitrox 30
      bottom(0.25, 0.25),  // Trimix 25/25
      bottom(0.21, 0.35),  // Trimix 21/35
      bottom(0.18, 0.45),  // Trimix 18/45
      bottom(0.15, 0.55),  // Trimix 15/55
      bottom(0.12, 0.60),  // Trimix 12/60
      bottom(0.10, 0.70),  // Trimix 10/70
    ])
  })

  it('lists the UTD deco gases', () => {
    expect(presetFor('UTD').deco).toEqual([
      deco(1, 0),        // Oxygen
      deco(0.50, 0),     // Nitrox 50
      deco(0.35, 0.25),  // Trimix 35/25
      deco(0.21, 0.35),  // Trimix 21/35
    ])
  })
})

describe('GUE standard gases', () => {
  it('lists the GUE bottom and travel gases (12/65, no 25/25)', () => {
    expect(presetFor('GUE').bottom).toEqual([
      bottom(0.21, 0),     // Air
      bottom(0.32, 0),     // Nitrox 32
      bottom(0.30, 0),     // Nitrox 30
      bottom(0.21, 0.35),  // Trimix 21/35
      bottom(0.18, 0.45),  // Trimix 18/45
      bottom(0.15, 0.55),  // Trimix 15/55
      bottom(0.12, 0.65),  // Trimix 12/65
      bottom(0.10, 0.70),  // Trimix 10/70
    ])
  })

  it('lists the GUE deco gases', () => {
    expect(presetFor('GUE').deco).toEqual([
      deco(1, 0),        // Oxygen
      deco(0.50, 0),     // Nitrox 50
      deco(0.35, 0.25),  // Trimix 35/25
      deco(0.21, 0.35),  // Trimix 21/35
    ])
  })
})

describe('TDI standard gases', () => {
  it('lists the TDI bottom and travel gases (30/30, no nitrox 30)', () => {
    expect(presetFor('TDI').bottom).toEqual([
      bottom(0.21, 0),     // Air
      bottom(0.32, 0),     // Nitrox 32
      bottom(0.30, 0.30),  // Trimix 30/30
      bottom(0.21, 0.35),  // Trimix 21/35
      bottom(0.18, 0.45),  // Trimix 18/45
      bottom(0.15, 0.55),  // Trimix 15/55
      bottom(0.10, 0.70),  // Trimix 10/70
    ])
  })

  it('lists only oxygen and nitrox 50 as TDI deco gases', () => {
    expect(presetFor('TDI').deco).toEqual([
      deco(1, 0),     // Oxygen
      deco(0.50, 0),  // Nitrox 50
    ])
  })
})

it('never defines a physically impossible mix', () => {
  agencyGasPresets.forEach(({ bottom, deco }) => {
    [...bottom, ...deco].forEach(gas => {
      expect(gas.fO2).toBeGreaterThan(0)
      expect(gas.fO2 + gas.fHe).toBeLessThanOrEqual(1)
    })
  })
})
