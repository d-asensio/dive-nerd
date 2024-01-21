import {pipe} from "ramda";

import {DivePlan, DivePlanLevel, DiveProfile, DiveSegment, Gas} from "./types";

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

  const calculateNearestMultipleOf3 = (num: number): number => {
    const residual = num % 3;

    if (residual === 0) return num;

    return residual >= 1.5 ? num - residual + 3 : num - residual;
  };

  const calculateMinimumDecoLevels = (lastDepth: number, totalTime: number, gas: Gas): DivePlanLevel[] => {
    const initialDepth = calculateNearestMultipleOf3(Math.round(lastDepth / 2));

    const levelsAbove6 = Math.floor(6 / 3) + 1;
    const levelsBelow6 = Math.floor((initialDepth - 6) / 3) + 1;

    const timeBelow6 = totalTime / 3;
    const timeAbove6 = (2 * totalTime) / 3;

    const timePerLevelAbove6 = timeAbove6 / levelsAbove6;
    const timePerLevelBelow6 = timeBelow6 / levelsBelow6;

    const decoLevelsAbove6 = Array.from({ length: levelsAbove6 }, (_, i) => ({
      depth: 6 - i * 3,
      duration: timePerLevelAbove6,
      gas
    }));

    const decoLevelsBelow6 = Array.from({ length: levelsBelow6 }, (_, i) => ({
      depth: initialDepth - i * 3,
      duration: timePerLevelBelow6,
      gas
    }));

    return [...decoLevelsBelow6, ...decoLevelsAbove6];
  };

  const calculateDivePlanSegments = ({ descentRate, ascentRate, levels }: DivePlan): DiveSegment[] => {
    const totalTime = levels.reduce((acc, { duration }) => acc + duration, 0);
    const { depth: lastDepth, gas } = levels[levels.length - 1];

    const minimumDecoLevels = calculateMinimumDecoLevels(lastDepth, totalTime, gas);

    const allLevels = [
      ...levels,
      ...minimumDecoLevels
    ]

    return levelsToSegmentsInterpolator.interpolate(allLevels, {descentRate, ascentRate});
  };

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
