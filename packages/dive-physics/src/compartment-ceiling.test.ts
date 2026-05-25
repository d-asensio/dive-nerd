import { compartmentCeilingAmbientPressure } from './compartment-ceiling'

describe('compartmentCeilingAmbientPressure', () => {
  const coefficients = {
    nitrogen: { a: 1.1696, b: 0.5578 },
    helium: { a: 1.6189, b: 0.4770 }
  }

  it('is below surface ambient pressure when the compartment is at surface saturation', () => {
    const surfaceAmbientPressure = 1.0133

    const result = compartmentCeilingAmbientPressure({
      inertLoad: { nitrogenPartialPressure: 0.74, heliumPartialPressure: 0 },
      coefficients,
      gradientFactor: 1
    })

    expect(result).toBeLessThan(surfaceAmbientPressure)
  })

  it('matches the raw Bühlmann ceiling at GF = 1: P_amb,tol = (P_t − a) · b', () => {
    const pN2 = 3.5

    const result = compartmentCeilingAmbientPressure({
      inertLoad: { nitrogenPartialPressure: pN2, heliumPartialPressure: 0 },
      coefficients,
      gradientFactor: 1
    })

    const expected = (pN2 - coefficients.nitrogen.a) * coefficients.nitrogen.b
    expect(result).toBeCloseTo(expected, 6)
  })

  it('is more conservative (deeper / higher ambient pressure) as GF decreases', () => {
    const inertLoad = { nitrogenPartialPressure: 3.5, heliumPartialPressure: 0 }

    const ceilingAtFullGf = compartmentCeilingAmbientPressure({
      inertLoad,
      coefficients,
      gradientFactor: 1
    })
    const ceilingAtLowGf = compartmentCeilingAmbientPressure({
      inertLoad,
      coefficients,
      gradientFactor: 0.3
    })

    expect(ceilingAtLowGf).toBeGreaterThan(ceilingAtFullGf)
  })

  it('approaches P_t as GF approaches 0 (no supersaturation tolerated)', () => {
    const inertLoad = { nitrogenPartialPressure: 3.5, heliumPartialPressure: 0 }

    const result = compartmentCeilingAmbientPressure({
      inertLoad,
      coefficients,
      gradientFactor: 0.0001
    })

    expect(result).toBeCloseTo(inertLoad.nitrogenPartialPressure, 2)
  })
})
