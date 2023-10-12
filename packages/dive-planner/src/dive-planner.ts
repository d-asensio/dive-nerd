import {pipe} from "ramda";

import {DivePlan, DiveProfile, DiveSegment} from "./types";

import buhlmannZHL16DecompressionAlgorithm from "./buhlmannZHL16-decompression-algorithm";
import defaultLevelsToSegmentsInterpolator from "./levels-to-segments-interpolator";

interface DivePlannerDependencies {
  decompressionAlgorithm?: typeof buhlmannZHL16DecompressionAlgorithm,
  levelsToSegmentsInterpolator?: typeof defaultLevelsToSegmentsInterpolator
}

interface DivePlanner {
  calculateDiveProfileFromPlanV1: (configuration: DivePlan) => DiveSegment[]
  calculateDiveProfileFromPlan: (configuration: DivePlan) => DiveProfile
}

export const createDivePlanner = (dependencies: DivePlannerDependencies = {}): DivePlanner => {

  const {
    decompressionAlgorithm = buhlmannZHL16DecompressionAlgorithm,
    levelsToSegmentsInterpolator = defaultLevelsToSegmentsInterpolator
  } = dependencies

  const calculateDivePlanSegments = ({ descentRate, ascentRate, levels }: DivePlan): DiveSegment[] =>
    levelsToSegmentsInterpolator.interpolate(levels, {descentRate, ascentRate})

  const calculateDiveProfileFromPlan = pipe(
    calculateDivePlanSegments,
    decompressionAlgorithm.calculateDiveProfileFromSegments
  )

  return {
    calculateDiveProfileFromPlanV1: calculateDivePlanSegments,
    calculateDiveProfileFromPlan
  }
}

export default createDivePlanner()
