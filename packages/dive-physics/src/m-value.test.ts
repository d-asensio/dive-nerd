import { buhlmannMValue } from './m-value'

describe('buhlmannMValue', () => {
  test.each([
    {
      labelCompartment: 'ZH-L16C compartment 1 (N2)',
      args: { coefficientA: 1.1696, coefficientB: 0.5578, ambientPressure: 1.0133 },
      expectedResult: 2.9863
    },
    {
      labelCompartment: 'ZH-L16C compartment 1 (N2) at 30 msw',
      args: { coefficientA: 1.1696, coefficientB: 0.5578, ambientPressure: 4 },
      expectedResult: 8.3406
    },
    {
      labelCompartment: 'ZH-L16C compartment 16 (N2) at the surface',
      args: { coefficientA: 0.2327, coefficientB: 0.9653, ambientPressure: 1.0133 },
      expectedResult: 1.2825
    }
  ])('is $expectedResult bar for $labelCompartment', ({ args, expectedResult }) => {
    const result = buhlmannMValue(args)

    expect(result).toBeCloseTo(expectedResult, 3)
  })
})
