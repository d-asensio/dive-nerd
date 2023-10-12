import {last, reduce} from "ramda";

import {
  DivePlanLevel,
  DivePlanSpeedOptions,
  DiveProfileIntervalType,
  DiveSegment
} from "./types";

export const createLevelsToSegmentsInterpolator = () => {
  const interpolate = (levels: DivePlanLevel[], {descentRate, ascentRate}: DivePlanSpeedOptions) =>
    reduce(
      (intervalsAcc: DiveSegment[], level: DivePlanLevel) => {
        const {
          finalDepth: initialDepth = 0,
          finalTime: initialTime = 0
        } = last(intervalsAcc) ?? {}

        const {
          duration,
          depth: finalDepth,
          gas
        } = level

        const depthDelta = finalDepth - initialDepth

        const rate =
          depthDelta < 0
            ? ascentRate
            : descentRate

        const deltaIntervalType =
          depthDelta < 0
            ? DiveProfileIntervalType.ASCENT
            : DiveProfileIntervalType.DESCENT

        const timeDelta = Math.abs(depthDelta / rate)

        const deltaInterval = {
          type: deltaIntervalType,
          initialTime,
          finalTime: initialTime + timeDelta,
          initialDepth,
          finalDepth,
          gas
        }

        if (timeDelta >= duration) {
          return [
            ...intervalsAcc,
            deltaInterval
          ]
        }

        const navigationInterval = {
          type: DiveProfileIntervalType.NAVIGATION,
          initialTime: deltaInterval.finalTime,
          finalTime: deltaInterval.initialTime + duration,
          initialDepth: deltaInterval.finalDepth,
          finalDepth: deltaInterval.finalDepth,
          gas
        }

        if (timeDelta === 0) {
          return [
            ...intervalsAcc,
            navigationInterval
          ]
        }

        return [
          ...intervalsAcc,
          deltaInterval,
          navigationInterval
        ]
      },
      [],
      levels
    )

  return { interpolate }
}
export default createLevelsToSegmentsInterpolator()
