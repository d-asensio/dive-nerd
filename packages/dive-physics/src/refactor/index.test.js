import {
  alveolarInertGasPartialPressure,
  alveolarWaterVaporPressure,
  getAirSaturatedCompartments, inertGasTimeConstant,
  inspiredGasChangeRate
} from './index'

describe('getAirSaturatedCompartments', () => {
  it.each([
    {
      labelDepth: 'the surface of the sea',
      labelUnits: 'fsw',
      compartments: [
        { name: '1b' },
        { name: '2' }
      ],
      surfaceAmbientPressure: 33,
      waterVaporPressure: 2.042,
      expectedResult: 24.4568
    },
    {
      labelDepth: 'the surface of the sea',
      labelUnits: 'bar',
      compartments: [
        { name: '1b' },
        { name: '2' }
      ],
      surfaceAmbientPressure: 1,
      waterVaporPressure: 0.0627,
      expectedResult: 0.7405
    },
    {
      labelDepth: '300 meters above sea level',
      labelUnits: 'bar',
      compartments: [
        { name: '1b' },
        { name: '2' }
      ],
      surfaceAmbientPressure: 0.96,
      waterVaporPressure: 0.0627,
      expectedResult: 0.7089
    }
  ])('should be $expectedResult $labelUnits at $labelDepth for all the compartments', ({
    compartments,
    surfaceAmbientPressure,
    waterVaporPressure,
    expectedResult
  }) => {
    const result = getAirSaturatedCompartments({
      compartments,
      surfaceAmbientPressure,
      waterVaporPressure
    })

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          gasLoad: {
            pN2: expect.closeTo(expectedResult, 3),
            pHe: 0
          }
        })
      ])
    )
  })
})

describe('inspiredGasChangeRate', () => {
  it.each([
    {
      labelUnits: 'fsw/min',
      descentRate: 60,
      inertGasFraction: 0.45,
      expectedResult: 27
    },
    {
      labelUnits: 'fsw/min',
      descentRate: 60,
      inertGasFraction: 0.40,
      expectedResult: 24
    }
  ])('should be $expectedResult $labelUnits for a descent rate of $descentRate $labelUnits and $inertGasFraction fraction of inert gas', ({
    descentRate,
    inertGasFraction,
    expectedResult
  }) => {
    const result = inspiredGasChangeRate({
      descentRate,
      inertGasFraction
    })

    expect(result).toBeCloseTo(expectedResult, 3)
  })
})

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
    },
    {
      labelUnits: 'bar',
      labelModeler: 'Schreiner',
      respiratoryQuotient: 0.8,
      carbonDioxidePressure: 0.0533,
      waterPressure: 0.0627,
      expectedResult: 0.0493
    },
    {
      labelUnits: 'bar',
      labelModeler: 'Workman',
      respiratoryQuotient: 0.9,
      carbonDioxidePressure: 0.0533,
      waterPressure: 0.0627,
      expectedResult: 0.0567
    },
    {
      labelUnits: 'bar',
      labelModeler: 'Bühlmann',
      respiratoryQuotient: 1,
      carbonDioxidePressure: 0.0533,
      waterPressure: 0.0627,
      expectedResult: 0.0627
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

describe('inertGasTimeConstant', () => {
  it.each([
    {
      inertGasHalfTime: 1.51,
      expectedResult: 0.459
    },
    {
      inertGasHalfTime: 4,
      expectedResult: 0.173
    }
  ])('should be $expectedResult for a half time of $inertGasHalfTime minutes', ({ inertGasHalfTime, expectedResult }) => {
    const result = inertGasTimeConstant({ inertGasHalfTime })

    expect(result).toBeCloseTo(expectedResult, 3)
  })
})
