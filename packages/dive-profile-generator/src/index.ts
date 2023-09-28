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
  const {descentRate} = divePlan.configuration

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
      const descentTimeDelta = depthDelta / descentRate

      const descentInterval = {
        type: DiveProfileIntervalType.DESCENT,
        startTime,
        endTime: startTime + descentTimeDelta,
        startDepth,
        endDepth
      }

      const navigationInterval = {
        type: DiveProfileIntervalType.NAVIGATION,
        startTime: descentInterval.endTime,
        endTime: descentInterval.startTime + duration,
        startDepth: descentInterval.endDepth,
        endDepth: descentInterval.endDepth
      }

      return [
        ...intervalsAcc,
        descentInterval,
        navigationInterval
      ]
    },
    [],
    divePlan.levels
  )
}