import {when} from "jest-when";
import {DivePlanLevel} from "./types";
import {createDivePlanner} from "./dive-planner";

describe('calculateDiveProfileFromPlan', () => {
  const decompressionAlgorithm = {
    calculateDiveProfileFromSegments: jest.fn()
  }

  const levelsToSegmentsInterpolator = {
    interpolate: jest.fn()
  }

  it('interpolates segments form levels and passes them to the decompression algorithm to calculate the dove plan', () => {
    const divePlanner = createDivePlanner({
      levelsToSegmentsInterpolator,
      decompressionAlgorithm
    })
    const levels: DivePlanLevel[] = []
    const options = {
      ascentRate: 10,
      descentRate: 9
    }
    const plan = {
      levels,
      ...options
    }
    const segments = Symbol('any-segments')
    const profile = Symbol('any-profile')
    when(levelsToSegmentsInterpolator.interpolate)
      .calledWith(levels, options)
      .mockReturnValue(segments)
    when(decompressionAlgorithm.calculateDiveProfileFromSegments)
      .calledWith(segments)
      .mockReturnValue(profile)

    const result = divePlanner.calculateDiveProfileFromPlan(plan)

    expect(result).toBe(profile)
  })
})
