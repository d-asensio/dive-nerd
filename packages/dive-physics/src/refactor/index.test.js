import { alveolarInertGasPartialPressure } from './index'

describe('alveolarInertGasPartialPressure', () => {
  it.each([
    {
      labelDepth: 'the surface',
      labelUnits: 'fsw',
      ambientPressure: 33,
      waterVaporPressure: 2.042,
      inertGasFraction: 0.4,
      expectedResult: 12.3832
    }
  ])('should be $expectedResult $labelUnits for $inertGasFraction fraction of inert gas at $labelUnits', ({
    ambientPressure,
    waterVaporPressure,
    inertGasFraction,
    expectedResult
  }) => {
    const result = alveolarInertGasPartialPressure({
      ambientPressure,
      waterVaporPressure,
      inertGasFraction
    })

    expect(result).toBe(expectedResult)
  })
})
