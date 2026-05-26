import divePlanner, { DiveProfileIntervalType, type DivePlan } from 'dive-planner'

import { calculateDiveProfile, fromAmbientPressureToDepth } from './calculate-dive-profile'

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

describe('fromAmbientPressureToDepth', () => {
  it('returns 0 m at the surface ambient pressure', () => {
    expect(fromAmbientPressureToDepth(SURFACE_AMBIENT_PRESSURE)).toBeCloseTo(0, 3)
  })

  it('round-trips through fromDepthToHydrostaticPressure', () => {
    // 30 m on standard seawater ≈ 4.024 bar absolute
    const depth = 30
    const pressureAtDepth = 1.0133 + (depth * 1023.6 * 9.80665) / 100000

    expect(fromAmbientPressureToDepth(pressureAtDepth)).toBeCloseTo(depth, 3)
  })
})

describe('ceilingDepth field', () => {
  it('is 0 on the surface seed sample', () => {
    const samples = calculateDiveProfile([], {
      gfLow: 0.3,
      gfHigh: 0.7,
      firstStopAmbientPressure: SURFACE_AMBIENT_PRESSURE,
    })

    expect(samples[0].ceilingDepth).toBe(0)
  })

  it('stays at 0 throughout an NDL dive (18 m × 10 min on air, GF 100/100)', () => {
    const samples = calculateDiveProfile(
      [
        {
          type: DiveProfileIntervalType.DESCENT,
          initialTime: 0,
          finalTime: 2,
          initialDepth: 0,
          finalDepth: 18,
          gas: air,
        },
        {
          type: DiveProfileIntervalType.NAVIGATION,
          initialTime: 2,
          finalTime: 12,
          initialDepth: 18,
          finalDepth: 18,
          gas: air,
        },
      ],
      {
        gfLow: 1,
        gfHigh: 1,
        firstStopAmbientPressure: SURFACE_AMBIENT_PRESSURE,
      },
    )

    samples.forEach(sample => {
      expect(sample.ceilingDepth).toBe(0)
    })
  })

  it('rises above 0 on a deco dive (40 m × 25 min on air, GF 30/70)', () => {
    // First stop on this profile is around 6 m → ≈ 1.616 bar absolute.
    const firstStopAmbientPressure = 1.0133 + (6 * 1023.6 * 9.80665) / 100000
    const samples = calculateDiveProfile(
      [
        {
          type: DiveProfileIntervalType.DESCENT,
          initialTime: 0,
          finalTime: 4,
          initialDepth: 0,
          finalDepth: 40,
          gas: air,
        },
        {
          type: DiveProfileIntervalType.NAVIGATION,
          initialTime: 4,
          finalTime: 29,
          initialDepth: 40,
          finalDepth: 40,
          gas: air,
        },
      ],
      {
        gfLow: 0.3,
        gfHigh: 0.7,
        firstStopAmbientPressure,
      },
    )

    const maxCeiling = samples.reduce((acc, s) => Math.max(acc, s.ceilingDepth), 0)

    expect(maxCeiling).toBeGreaterThan(0)
    // Sanity bound: a 40 m × 25 min dive on air shouldn't produce a ceiling
    // deeper than the bottom depth.
    expect(maxCeiling).toBeLessThan(40)
  })

  it('max ceiling lines up with the planner-computed first deco stop (40 m × 25 min on air, GF 30/70)', () => {
    // Independent computation by the planner — gives us the actual first DECO_STOP depth.
    const plan: DivePlan = {
      descentRate: 18,
      ascentRate: 9,
      gradientFactorLow: 0.3,
      gradientFactorHigh: 0.7,
      switchAtMod: true,
      lastStopDepth: 3,
      levels: [{ depth: 40, duration: 25, gas: air }],
      availableGases: [air],
    }
    const intervals = divePlanner.calculateDiveProfileFromPlan(plan).intervals
    const firstStop = intervals.find(({ type }) => type === DiveProfileIntervalType.DECO_STOP)

    if (!firstStop) {
      throw new Error('Test profile expected to produce a deco stop')
    }

    const firstStopAmbientPressure = 1.0133 + (firstStop.finalDepth * 1023.6 * 9.80665) / 100000

    // Compute the per-sample ceiling for the same plan.
    const samples = calculateDiveProfile(intervals, {
      gfLow: 0.3,
      gfHigh: 0.7,
      firstStopAmbientPressure,
    })

    const maxCeiling = samples.reduce((acc, s) => Math.max(acc, s.ceilingDepth), 0)

    // The two independent computations should agree on the first-stop depth within 3 m.
    // (Tolerance accounts for the 0.5 s integration step and the 3 m stop-grid rounding
    //  the planner applies; both are documented and stable.)
    expect(Math.abs(maxCeiling - firstStop.finalDepth)).toBeLessThan(3)
  })
})
