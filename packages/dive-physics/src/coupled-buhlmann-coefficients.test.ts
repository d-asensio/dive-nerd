import { coupledBuhlmannCoefficients } from './coupled-buhlmann-coefficients'

describe('coupledBuhlmannCoefficients', () => {
  const compartment1Coefficients = {
    nitrogen: { a: 1.1696, b: 0.5578 },
    helium: { a: 1.6189, b: 0.4770 }
  }

  it('returns the nitrogen coefficients when both inert tensions are zero', () => {
    const result = coupledBuhlmannCoefficients({
      inertLoad: { nitrogenPartialPressure: 0, heliumPartialPressure: 0 },
      coefficients: compartment1Coefficients
    })

    expect(result).toStrictEqual(compartment1Coefficients.nitrogen)
  })

  it('returns the nitrogen coefficients when only nitrogen is loaded', () => {
    const result = coupledBuhlmannCoefficients({
      inertLoad: { nitrogenPartialPressure: 0.74, heliumPartialPressure: 0 },
      coefficients: compartment1Coefficients
    })

    expect(result.a).toBeCloseTo(compartment1Coefficients.nitrogen.a, 6)
    expect(result.b).toBeCloseTo(compartment1Coefficients.nitrogen.b, 6)
  })

  it('returns the helium coefficients when only helium is loaded', () => {
    const result = coupledBuhlmannCoefficients({
      inertLoad: { nitrogenPartialPressure: 0, heliumPartialPressure: 1.2 },
      coefficients: compartment1Coefficients
    })

    expect(result.a).toBeCloseTo(compartment1Coefficients.helium.a, 6)
    expect(result.b).toBeCloseTo(compartment1Coefficients.helium.b, 6)
  })

  it('returns the weighted average for a trimix-loaded compartment', () => {
    // 70% of the load is N2, 30% is He
    const result = coupledBuhlmannCoefficients({
      inertLoad: { nitrogenPartialPressure: 2.8, heliumPartialPressure: 1.2 },
      coefficients: compartment1Coefficients
    })

    const expectedA = (1.1696 * 2.8 + 1.6189 * 1.2) / 4
    const expectedB = (0.5578 * 2.8 + 0.4770 * 1.2) / 4
    expect(result.a).toBeCloseTo(expectedA, 6)
    expect(result.b).toBeCloseTo(expectedB, 6)
  })
})
