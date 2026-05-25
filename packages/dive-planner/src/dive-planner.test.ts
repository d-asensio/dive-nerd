import { when } from 'jest-when'

import { createDivePlanner } from './dive-planner'
import { DivePlan, DiveProfile, DiveSegment } from './types'

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
