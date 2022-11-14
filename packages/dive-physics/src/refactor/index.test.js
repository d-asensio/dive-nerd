import {
  alveolarInertGasPartialPressure,
  alveolarWaterVaporPressure
} from './index'

describe('alveolarWaterVaporPressure', () => {
  it.each([
    {
      labelUnits: 'mm Hm',
      labelModeler: 'Schreiner',
      respiratoryQuotient: 0.8,
      carbonDioxidePressure: 40,
      waterPressure: 47,
      expectedResult: 37
    },
    {
      labelUnits: 'mm Hm',
      labelModeler: 'Workman',
      respiratoryQuotient: 0.9,
      carbonDioxidePressure: 40,
      waterPressure: 47,
      expectedResult: 42.5555
    },
    {
      labelUnits: 'mm Hm',
      labelModeler: 'Bühlmann',
      respiratoryQuotient: 1,
      carbonDioxidePressure: 40,
      waterPressure: 47,
      expectedResult: 47
    }
  ])('should be $expectedResult $labelUnits according to $labelModeler, using $respiratoryQuotient as respiratory quotient', ({
    respiratoryQuotient,
    carbonDioxidePressure,
    waterPressure,
    expectedResult
  }) => {
    const result = alveolarWaterVaporPressure({
      respiratoryQuotient,
      carbonDioxidePressure,
      waterPressure
    })

    expect(result).toBeCloseTo(expectedResult, 3)
  })
})

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
