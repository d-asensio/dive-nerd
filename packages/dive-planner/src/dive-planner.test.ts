import { when } from 'jest-when'

import { createDivePlanner } from './dive-planner'
import { DivePlan, DiveProfile, DiveProfileIntervalType, DiveSegment } from './types'

describe('calculateDiveProfileFromPlan', () => {
  it('interpolates the user levels into segments and feeds them to the decompression algorithm', () => {
    const segments = [Symbol('any-segments')] as unknown as DiveSegment[]
    const profile = { intervals: segments } as DiveProfile

    const levelsToSegmentsInterpolator = { interpolate: jest.fn() }
    const decompressionAlgorithm = { calculateDiveProfileFromSegments: jest.fn() }
    const buildDecompressionAlgorithm = jest.fn().mockReturnValue(decompressionAlgorithm)

    const plan: DivePlan = {
      descentRate: 10,
      ascentRate: 9,
      levels: []
    }

    when(levelsToSegmentsInterpolator.interpolate)
      .calledWith(plan.levels, { descentRate: plan.descentRate, ascentRate: plan.ascentRate })
      .mockReturnValue(segments)
    when(decompressionAlgorithm.calculateDiveProfileFromSegments)
      .calledWith(segments)
      .mockReturnValue(profile)

    const divePlanner = createDivePlanner({
      levelsToSegmentsInterpolator,
      buildDecompressionAlgorithm
    })

    const result = divePlanner.calculateDiveProfileFromPlan(plan)

    expect(result).toBe(profile)
    expect(buildDecompressionAlgorithm).toHaveBeenCalledWith(plan)
  })
})

describe('calculateDiveProfileFromPlan — CCR with bailout', () => {
  const diluent = { fO2: 0.21, fHe: 0, isDecoGas: false }
  const deco50 = { fO2: 0.5, fHe: 0, isDecoGas: true }

  it('returns a loop profile plus an OC bailout schedule from end of bottom time', () => {
    const planner = createDivePlanner()

    const profile = planner.calculateDiveProfileFromPlan({
      descentRate: 20,
      ascentRate: 9,
      gradientFactorLow: 0.3,
      gradientFactorHigh: 0.85,
      circuit: 'CCR',
      diluent,
      setpointLow: 0.7,
      setpointHigh: 1.3,
      availableGases: [diluent, deco50],
      levels: [{ depth: 45, duration: 30, gas: diluent }]
    })

    // Primary schedule is on the loop (CCR-tagged generated segments).
    const generated = profile.intervals.filter(
      s => s.type === DiveProfileIntervalType.DECO_STOP
    )
    expect(generated.every(s => s.circuit === 'CCR')).toBe(true)

    // Bailout exists and is open circuit (no CCR tags on its segments).
    expect(profile.bailout).toBeDefined()
    expect(profile.bailout!.intervals.length).toBeGreaterThan(0)
    expect(profile.bailout!.intervals.every(s => s.circuit !== 'CCR')).toBe(true)
  })

  it('omits bailout for an OC plan', () => {
    const planner = createDivePlanner()
    const profile = planner.calculateDiveProfileFromPlan({
      descentRate: 20,
      ascentRate: 9,
      gradientFactorLow: 0.3,
      gradientFactorHigh: 0.85,
      availableGases: [diluent],
      levels: [{ depth: 30, duration: 20, gas: diluent }]
    })

    expect(profile.bailout).toBeUndefined()
  })
})
