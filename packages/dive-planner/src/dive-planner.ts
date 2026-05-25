import { DivePlan, DiveProfile, DiveSegment } from './types'

import { createBuhlmannZHL16Algorithm } from './buhlmannZHL16-decompression-algorithm'
import defaultLevelsToSegmentsInterpolator from './levels-to-segments-interpolator'

interface DecompressionAlgorithm {
  calculateDiveProfileFromSegments: (segments: DiveSegment[]) => DiveProfile
}

interface DivePlannerDependencies {
  buildDecompressionAlgorithm?: (plan: DivePlan) => DecompressionAlgorithm
  levelsToSegmentsInterpolator?: typeof defaultLevelsToSegmentsInterpolator
}

interface DivePlanner {
  /** @deprecated use `calculateDiveProfileFromPlan`. Retained for the legacy
   *  fake-deco visualisation that the web app no longer uses. */
  calculateDiveProfileFromPlanV1: (plan: DivePlan) => DiveSegment[]
  calculateDiveProfileFromPlan: (plan: DivePlan) => DiveProfile
}

const defaultBuildDecompressionAlgorithm = (plan: DivePlan): DecompressionAlgorithm =>
  createBuhlmannZHL16Algorithm({}, {
    ascentRate: plan.ascentRate,
    gradientFactors:
      plan.gradientFactorLow !== undefined && plan.gradientFactorHigh !== undefined
        ? { gfLow: plan.gradientFactorLow, gfHigh: plan.gradientFactorHigh }
        : undefined,
    environment:
      plan.surfaceAmbientPressure !== undefined &&
      plan.waterDensity !== undefined &&
      plan.waterVaporPressure !== undefined
        ? {
            surfaceAmbientPressure: plan.surfaceAmbientPressure,
            waterDensity: plan.waterDensity,
            waterVaporPressure: plan.waterVaporPressure
          }
        : undefined,
    availableGases: plan.availableGases,
    switchAtMod: plan.switchAtMod,
    lastStopDepth: plan.lastStopDepth
  })

export const createDivePlanner = (dependencies: DivePlannerDependencies = {}): DivePlanner => {
  const {
    buildDecompressionAlgorithm = defaultBuildDecompressionAlgorithm,
    levelsToSegmentsInterpolator = defaultLevelsToSegmentsInterpolator
  } = dependencies

  const calculateUserSegments = (plan: DivePlan): DiveSegment[] =>
    levelsToSegmentsInterpolator.interpolate(plan.levels, {
      descentRate: plan.descentRate,
      ascentRate: plan.ascentRate
    })

  const calculateDiveProfileFromPlan = (plan: DivePlan): DiveProfile => {
    const segments = calculateUserSegments(plan)
    return buildDecompressionAlgorithm(plan).calculateDiveProfileFromSegments(segments)
  }

  return {
    calculateDiveProfileFromPlanV1: calculateUserSegments,
    calculateDiveProfileFromPlan
  }
}

export default createDivePlanner()
