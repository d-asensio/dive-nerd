import { alveolarInertGasPartialPressure } from './index'

describe('alveolarInertGasPartialPressure', () => {
  it.each([
    {
      labelDepth: 'the surface of the sea',
      labelUnits: 'fsw',
      ambientPressure: 33,
      waterVaporPressure: 2.042,
      inertGasFraction: 0.4,
      expectedResult: 12.3832
    },
    {
      labelDepth: 'the surface of the sea',
      labelUnits: 'msw',
      ambientPressure: 10,
      waterVaporPressure: 0.627,
      inertGasFraction: 0.4,
      expectedResult: 3.7492
    },
    {
      labelDepth: 'the surface of the sea',
      labelUnits: 'msw',
      ambientPressure: 10,
      waterVaporPressure: 0.627,
      inertGasFraction: 0.79,
      expectedResult: 7.4046
    },
    {
      labelDepth: '10 meters from sea surface',
      labelUnits: 'msw',
      ambientPressure: 20,
      waterVaporPressure: 0.627,
      inertGasFraction: 0.79,
      expectedResult: 15.3046
    },
    {
      labelDepth: '10 meters from sea surface',
      labelUnits: 'bar',
      ambientPressure: 2,
      waterVaporPressure: 0.0627,
      inertGasFraction: 0.79,
      expectedResult: 1.5304
    }
  ])('should be $expectedResult $labelUnits for $inertGasFraction fraction of inert gas at $labelDepth', ({
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

    expect(result).toBeCloseTo(expectedResult, 3)
  })
})
