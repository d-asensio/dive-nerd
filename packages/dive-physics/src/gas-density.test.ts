import { gasDensity } from './gas-density'

const expectClose = (actual: number, expected: number, tolerance = 0.05) => {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance)
}

describe('gasDensity', () => {
  it('returns ~1.2 g/L for air at the surface (1 bar)', () => {
    // Textbook value for dry air at ~20 °C and 1 bar.
    expectClose(
      gasDensity({ oxygenFraction: 0.21, heliumFraction: 0, ambientPressure: 1 }),
      1.19,
    )
  })

  it('scales linearly with pressure for the same mix', () => {
    const atSurface = gasDensity({ oxygenFraction: 0.21, heliumFraction: 0, ambientPressure: 1 })
    const atFourBar = gasDensity({ oxygenFraction: 0.21, heliumFraction: 0, ambientPressure: 4 })
    expectClose(atFourBar, atSurface * 4)
  })

  it('returns ~2.1 g/L for pure oxygen at 6 m (1.6 bar)', () => {
    expectClose(
      gasDensity({ oxygenFraction: 1, heliumFraction: 0, ambientPressure: 1.6 }),
      2.10,
    )
  })

  it('returns a much lower density for helium-rich trimix at depth', () => {
    // Trimix 18/45 at 7 bar (~60 m). Helium drastically lowers the molar mass.
    const trimix = gasDensity({ oxygenFraction: 0.18, heliumFraction: 0.45, ambientPressure: 7 })
    const airAt7Bar = gasDensity({ oxygenFraction: 0.21, heliumFraction: 0, ambientPressure: 7 })
    expect(trimix).toBeLessThan(airAt7Bar * 0.65)
    // Sanity: GUE-grade density (≤ 5.2 g/L target) on a 60 m trimix.
    expect(trimix).toBeLessThan(5.5)
  })

  it('uses the provided temperature (denser when colder)', () => {
    const at20C = gasDensity({ oxygenFraction: 0.21, heliumFraction: 0, ambientPressure: 4, temperature: 293.15 })
    const at4C  = gasDensity({ oxygenFraction: 0.21, heliumFraction: 0, ambientPressure: 4, temperature: 277.15 })
    expect(at4C).toBeGreaterThan(at20C)
  })
})
