import {last, reduce} from "ramda";

interface DivePlanConfiguration {
  descentRate: number
  ascentRate: number
}

interface DivePlanLevel {
  duration: number,
  depth: number
}

export interface DivePlan {
  configuration: DivePlanConfiguration
  levels: DivePlanLevel[]
}

export enum DiveProfileIntervalType {
  DESCENT,
  NAVIGATION,
  ASCENT,
  DECO_STOP
}

interface DiveProfileInterval {
  type: DiveProfileIntervalType
  startTime: number
  endTime: number
  startDepth: number
  endDepth: number
}

export const calculatesIntervalsFromPlan = (divePlan: DivePlan): DiveProfileInterval[] => {
  const {descentRate, ascentRate} = divePlan.configuration

  return reduce(
    (intervalsAcc: DiveProfileInterval[], level: DivePlanLevel) => {
      const {
        endDepth: startDepth = 0,
        endTime: startTime = 0
      } = last(intervalsAcc) ?? {}

      const {
        duration,
        depth: endDepth
      } = level

      const depthDelta = endDepth - startDepth

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
        startTime,
        endTime: startTime + timeDelta,
        startDepth,
        endDepth
      }

      if (timeDelta > duration) {
        return [
          ...intervalsAcc,
          deltaInterval
        ]
      }

      const navigationInterval = {
        type: DiveProfileIntervalType.NAVIGATION,
        startTime: deltaInterval.endTime,
        endTime: deltaInterval.startTime + duration,
        startDepth: deltaInterval.endDepth,
        endDepth: deltaInterval.endDepth
      }

      return [
        ...intervalsAcc,
        deltaInterval,
        navigationInterval
      ]
    },
    [],
    divePlan.levels
  )
}