import {
  alveolarInertGasPartialPressure,
  alveolarWaterVaporPressure,
  getAirSaturatedCompartments, inertGasTimeConstant,
  inspiredGasChangeRate, schreinerEquation
} from './index'

describe('getAirSaturatedCompartments', () => {
  test.each([
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
  test.each([
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
  test.each([
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
  test.each([
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
  test.each([
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

describe('schreinerEquation', () => {
  test.each([
    {
      labelTestCase: 'in a first dive, the total partial pressure of Helium for Bühlmann compartment 1 in a descent from 0 to 120 fsw at 60 fsw/min',
      labelUnits: 'fsw',
      initialInspiredGasPartialPressure: 13.93,
      initialCompartmentGasPartialPressure: 0,
      gasTimeConstant: 0.459,
      gasChangeRate: 27,
      intervalTime: 2,
      expectedResult: 27.0332
    },
    {
      labelTestCase: 'in a first dive, the total partial pressure of Nitrogen for Bühlmann compartment 1 in a descent from 0 to 120 fsw at 60 fsw/min',
      labelUnits: 'fsw',
      initialInspiredGasPartialPressure: 12.38,
      initialCompartmentGasPartialPressure: 24.46,
      gasTimeConstant: 0.173,
      gasChangeRate: 24,
      intervalTime: 2,
      expectedResult: 28.3504
    }
  ])('$labelTestCase should be $expectedResult $labelUnits', ({
    initialInspiredGasPartialPressure,
    initialCompartmentGasPartialPressure,
    gasTimeConstant,
    gasChangeRate,
    intervalTime,
    expectedResult
  }) => {
    const result = schreinerEquation({
      initialInspiredGasPartialPressure,
      initialCompartmentGasPartialPressure,
      gasTimeConstant,
      gasChangeRate,
      intervalTime
    })

    expect(result).toBeCloseTo(expectedResult, 3)
  })
})
