import { buhlmannCompartments } from './buhlmannCompartments'
import { divingCeilingAmbientPressure } from './diving-ceiling'
import { compartmentCeilingAmbientPressure } from './compartment-ceiling'

const toCoefficients = (c: typeof buhlmannCompartments[number]) => ({
  nitrogen: { a: c.N2.a, b: c.N2.b },
  helium: { a: c.He.a, b: c.He.b }
})

describe('divingCeilingAmbientPressure', () => {
  const compartmentCoefficients = buhlmannCompartments.map(toCoefficients)

  it('is below surface ambient pressure when every compartment is at surface saturation', () => {
    const surfaceAmbientPressure = 1.0133
    const compartmentLoads = compartmentCoefficients.map(() => ({
      nitrogenPartialPressure: 0.74,
      heliumPartialPressure: 0
    }))

    const result = divingCeilingAmbientPressure({
      compartmentLoads,
      compartmentCoefficients,
      gradientFactor: 0.85
    })

    expect(result).toBeLessThan(surfaceAmbientPressure)
  })

  it('equals the ceiling of the most-loaded compartment', () => {
    const compartmentLoads = compartmentCoefficients.map((_, index) => ({
      nitrogenPartialPressure: index === 3 ? 3.5 : 0.74,
      heliumPartialPressure: 0
    }))

    const result = divingCeilingAmbientPressure({
      compartmentLoads,
      compartmentCoefficients,
      gradientFactor: 0.3
    })

    const expected = compartmentCeilingAmbientPressure({
      inertLoad: compartmentLoads[3],
      coefficients: compartmentCoefficients[3],
      gradientFactor: 0.3
    })
    expect(result).toBeCloseTo(expected, 6)
  })

  it('throws when loads and coefficients have different lengths', () => {
    expect(() =>
      divingCeilingAmbientPressure({
        compartmentLoads: [{ nitrogenPartialPressure: 1, heliumPartialPressure: 0 }],
        compartmentCoefficients,
        gradientFactor: 0.85
      })
    ).toThrow(/same length/)
  })
})
