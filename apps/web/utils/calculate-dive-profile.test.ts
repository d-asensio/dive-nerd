import { DiveProfileIntervalType } from 'dive-planner'

import { calculateDiveProfile } from './calculate-dive-profile'

const SURFACE_AMBIENT_PRESSURE = 1.0133

const air = { fO2: 0.21, fHe: 0, isDecoGas: false }

describe('calculateDiveProfile', () => {
  const noDecoOptions = {
    gfLow: 1,
    gfHigh: 1,
    firstStopAmbientPressure: SURFACE_AMBIENT_PRESSURE,
  }

  describe('depth field', () => {
    it('starts at 0 m on the surface seed sample', () => {
      const samples = calculateDiveProfile([], noDecoOptions)

      expect(samples).toHaveLength(1)
      expect(samples[0].depth).toBeCloseTo(0, 3)
    })

    it('matches the interpolated segment depths', () => {
      const samples = calculateDiveProfile(
        [
          {
            type: DiveProfileIntervalType.DESCENT,
            initialTime: 0,
            finalTime: 2,
            initialDepth: 0,
            finalDepth: 20,
            gas: air,
          },
        ],
        noDecoOptions,
      )

      const last = samples[samples.length - 1]
      expect(last.depth).toBeCloseTo(20, 1)

      // Every sample is between surface and the final depth.
      expect(samples.every(s => s.depth >= 0 && s.depth <= 20)).toBe(true)

      // Depth is monotonically non-decreasing across the descent.
      for (let i = 1; i < samples.length; i++) {
        expect(samples[i].depth).toBeGreaterThanOrEqual(samples[i - 1].depth)
      }
    })
  })
})
