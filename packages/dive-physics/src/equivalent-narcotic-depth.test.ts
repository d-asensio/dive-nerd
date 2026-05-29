import { equivalentNarcoticDepth } from './equivalent-narcotic-depth'
import { fromDepthToHydrostaticPressure } from './index'

// Sea water / atmospheric defaults — consistent with the planner's environment.
const ENV = {
  surfaceAmbientPressure: 1.0133,
  waterDensity: 1023.6,
}

const expectClose = (actual: number, expected: number, tolerance = 0.6) => {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance)
}

const ambientAt = (depth: number) =>
  fromDepthToHydrostaticPressure({ depth, ...ENV })

describe('equivalentNarcoticDepth', () => {
  it('equals the actual depth for a helium-free mix (air or nitrox)', () => {
    expectClose(
      equivalentNarcoticDepth({ heliumFraction: 0, ambientPressure: ambientAt(30), ...ENV }),
      30,
    )
  })

  it('is shallower than the actual depth for a helium-rich trimix', () => {
    // Trimix 18/45 at 60 m — He drops the narcotic-equivalent depth well
    // below the 30 m narcotic limit traditionally used by tech divers.
    const end = equivalentNarcoticDepth({ heliumFraction: 0.45, ambientPressure: ambientAt(60), ...ENV })
    expect(end).toBeLessThan(30)
    expect(end).toBeGreaterThan(20)
  })

  it('clamps to 0 for pure helium', () => {
    const end = equivalentNarcoticDepth({ heliumFraction: 1, ambientPressure: ambientAt(50), ...ENV })
    expect(end).toBe(0)
  })

  it('returns 0 at the surface regardless of mix', () => {
    expectClose(
      equivalentNarcoticDepth({ heliumFraction: 0, ambientPressure: ENV.surfaceAmbientPressure, ...ENV }),
      0,
    )
  })
})
