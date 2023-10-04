import {
  alveolarInertGasPartialPressure,
  alveolarWaterVaporPressure,
  fromDepthToHydrostaticPressure,
  getSurfaceSaturatedCompartmentInertGasLoads,
  inertGasTimeConstant,
  inspiredGasChangeRate,
  schreinerEquation
} from './index'

describe('getSurfaceSaturatedCompartmentInertGasLoads', () => {
  test.each([
    {
      labelDepth: 'the surface of the sea',
      labelUnits: 'fsw',
      args: {
        surfaceAmbientPressure: 33,
        waterVaporPressure: 2.042
      },
      expectedResult: 24.4568
    },
    {
      labelDepth: 'the surface of the sea',
      labelUnits: 'bar',
      args: {
        surfaceAmbientPressure: 1,
        waterVaporPressure: 0.0627
      },
      expectedResult: 0.7405
    },
    {
      labelDepth: '300 meters above sea level',
      labelUnits: 'bar',
      args: {
        surfaceAmbientPressure: 0.96,
        waterVaporPressure: 0.0627
      },
      expectedResult: 0.7089
    }
  ])('should be $expectedResult $labelUnits at $labelDepth for all the compartments', ({ args, expectedResult }) => {
    const result = getSurfaceSaturatedCompartmentInertGasLoads(args)

    expect(result).toHaveLength(16)
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining( {
          N2: expect.closeTo(expectedResult, 3),
          He: 0
        })
      ])
    )
  })
})

describe('inspiredGasChangeRate', () => {
  test.each([
    {
      labelUnits: 'fsw/min',
      args: {
        descentRate: 60,
        inertGasFraction: 0.45
      },
      expectedResult: 27
    },
    {
      labelUnits: 'fsw/min',
      args: {
        descentRate: 60,
        inertGasFraction: 0.40
      },
      expectedResult: 24
    }
  ])('should be $expectedResult $labelUnits for a descent rate of $args.descentRate $labelUnits and $args.inertGasFraction fraction of inert gas', ({ args, expectedResult }) => {
    const result = inspiredGasChangeRate(args)

    expect(result).toBeCloseTo(expectedResult, 3)
  })
})

describe('alveolarWaterVaporPressure', () => {
  test.each([
    {
      labelUnits: 'mm Hm',
      labelModeler: 'Schreiner',
      args: {
        respiratoryQuotient: 0.8,
        carbonDioxidePressure: 40,
        waterPressure: 47
      },
      expectedResult: 37
    },
    {
      labelUnits: 'mm Hm',
      labelModeler: 'Workman',
      args: {
        respiratoryQuotient: 0.9,
        carbonDioxidePressure: 40,
        waterPressure: 47
      },
      expectedResult: 42.5555
    },
    {
      labelUnits: 'mm Hm',
      labelModeler: 'Bühlmann',
      args: {
        respiratoryQuotient: 1,
        carbonDioxidePressure: 40,
        waterPressure: 47
      },
      expectedResult: 47
    },
    {
      labelUnits: 'bar',
      labelModeler: 'Schreiner',
      args: {
        respiratoryQuotient: 0.8,
        carbonDioxidePressure: 0.0533,
        waterPressure: 0.0627
      },
      expectedResult: 0.0493
    },
    {
      labelUnits: 'bar',
      labelModeler: 'Workman',
      args: {
        respiratoryQuotient: 0.9,
        carbonDioxidePressure: 0.0533,
        waterPressure: 0.0627
      },
      expectedResult: 0.0567
    },
    {
      labelUnits: 'bar',
      labelModeler: 'Bühlmann',
      args: {
        respiratoryQuotient: 1,
        carbonDioxidePressure: 0.0533,
        waterPressure: 0.0627
      },
      expectedResult: 0.0627
    }
  ])('should be $expectedResult $labelUnits according to $labelModeler, using $args.respiratoryQuotient as respiratory quotient', ({ args, expectedResult }) => {
    const result = alveolarWaterVaporPressure(args)

    expect(result).toBeCloseTo(expectedResult, 3)
  })
})

describe('alveolarInertGasPartialPressure', () => {
  test.each([
    {
      labelDepth: 'the surface of the sea',
      labelUnits: 'fsw',
      args: {
        ambientPressure: 33,
        waterVaporPressure: 2.042,
        inertGasFraction: 0.4
      },
      expectedResult: 12.3832
    },
    {
      labelDepth: 'the surface of the sea',
      labelUnits: 'msw',
      args: {
        ambientPressure: 10,
        waterVaporPressure: 0.627,
        inertGasFraction: 0.4
      },
      expectedResult: 3.7492
    },
    {
      labelDepth: 'the surface of the sea',
      labelUnits: 'msw',
      args: {
        ambientPressure: 10,
        waterVaporPressure: 0.627,
        inertGasFraction: 0.79
      },
      expectedResult: 7.4046
    },
    {
      labelDepth: '10 meters from sea surface',
      labelUnits: 'msw',
      args: {
        ambientPressure: 20,
        waterVaporPressure: 0.627,
        inertGasFraction: 0.79
      },
      expectedResult: 15.3046
    },
    {
      labelDepth: '10 meters from sea surface',
      labelUnits: 'bar',
      args: {
        ambientPressure: 2,
        waterVaporPressure: 0.0627,
        inertGasFraction: 0.79
      },
      expectedResult: 1.5304
    }
  ])('should be $expectedResult $labelUnits for $args.inertGasFraction fraction of inert gas at $labelDepth', ({ args, expectedResult }) => {
    const result = alveolarInertGasPartialPressure(args)

    expect(result).toBeCloseTo(expectedResult, 3)
  })
})

describe('inertGasTimeConstant', () => {
  test.each([
    {
      args: {
        inertGasHalfTime: 1.51
      },
      expectedResult: 0.459
    },
    {
      args: {
        inertGasHalfTime: 4
      },
      expectedResult: 0.173
    }
  ])('should be $expectedResult for a half time of $args.inertGasHalfTime minutes', ({ args, expectedResult }) => {
    const result = inertGasTimeConstant(args)

    expect(result).toBeCloseTo(expectedResult, 3)
  })
})

describe('schreinerEquation', () => {
  test.each([
    {
      labelTestCase: 'in a first dive, the total partial pressure of Helium for Bühlmann compartment 1 in a descent from 0 to 120 fsw at 60 fsw/min',
      labelUnits: 'fsw',
      args: {
        initialAlveolarGasPartialPressure: 13.93,
        initialCompartmentGasPartialPressure: 0,
        gasTimeConstant: 0.459,
        gasChangeRate: 27,
        intervalTime: 2
      },
      expectedResult: 27.0332
    },
    {
      labelTestCase: 'in a first dive, the total partial pressure of Nitrogen for Bühlmann compartment 1 in a descent from 0 to 120 fsw at 60 fsw/min',
      labelUnits: 'fsw',
      args: {
        initialAlveolarGasPartialPressure: 12.38,
        initialCompartmentGasPartialPressure: 24.46,
        gasTimeConstant: 0.173,
        gasChangeRate: 24,
        intervalTime: 2
      },
      expectedResult: 28.3504
    }
  ])('$labelTestCase should be $expectedResult $labelUnits', ({ args, expectedResult }) => {
    const result = schreinerEquation(args)

    expect(result).toBeCloseTo(expectedResult, 3)
  })
})

describe('fromDepthToHydrostaticPressure', () => {
  test.each([
    {
      labelWater: 'sea',
      args: {
        waterDensity: 1023.6,
        depth: 1,
        surfacePressure: 1.0133
      },
      expectedResult: 1.1136
    },
    {
      labelWater: 'sea',
      args: {
        waterDensity: 1023.6,
        depth: 10,
        surfacePressure: 1.0133
      },
      expectedResult: 2.0171
    },
    {
      labelWater: 'fresh',
      args: {
        waterDensity: 997.0474,
        depth: 1,
        surfacePressure: 1.0133
      },
      expectedResult: 1.111
    },
    {
      labelWater: 'fresh',
      args: {
        waterDensity: 997.0474,
        depth: 10,
        surfacePressure: 1.0133
      },
      expectedResult: 1.991
    }
  ])('$args.depth meters below $labelWater water is $expectedResult bar', ({ args, expectedResult }) => {
    const result = fromDepthToHydrostaticPressure(args)

    expect(result).toBeCloseTo(expectedResult, 3)
  })
})
