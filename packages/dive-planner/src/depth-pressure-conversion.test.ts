import { createDepthPressureConverter } from './depth-pressure-conversion'

describe('createDepthPressureConverter', () => {
  const environment = {
    surfaceAmbientPressure: 1.0133,
    waterDensity: 1023.6,
    waterVaporPressure: 0.0567
  }
  const { depthToAmbientPressure, ambientPressureToDepth } =
    createDepthPressureConverter(environment)

  it('returns the surface ambient pressure at 0 m', () => {
    expect(depthToAmbientPressure(0)).toBeCloseTo(environment.surfaceAmbientPressure, 4)
  })

  it('is the inverse of itself (round-trip for 0..50 m)', () => {
    for (const depth of [0, 3, 6, 18, 30, 45, 50]) {
      const roundTripped = ambientPressureToDepth(depthToAmbientPressure(depth))
      expect(roundTripped).toBeCloseTo(depth, 4)
    }
  })

  it('returns 0 m at the surface ambient pressure', () => {
    expect(ambientPressureToDepth(environment.surfaceAmbientPressure)).toBeCloseTo(0, 4)
  })
})
