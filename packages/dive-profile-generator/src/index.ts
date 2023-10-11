import {last, reduce} from "ramda";

export interface GasMix {
  fO2: number
  fHe: number
}

interface DivePlanLevel {
  duration: number
  depth: number
  gasMix: GasMix
}

export interface DivePlan {
  descentRate: number
  ascentRate: number
  levels: DivePlanLevel[]
}

export enum DiveProfileIntervalType {
  DESCENT = 'DESCENT',
  NAVIGATION = 'NAVIGATION',
  ASCENT = 'ASCENT',
  DECO_STOP = 'DECO_STOP'
}

export interface DiveProfileInterval {
  type: DiveProfileIntervalType
  startTime: number
  endTime: number
  startDepth: number
  endDepth: number
  gasMix: GasMix
}

export const calculatesIntervalsFromPlan = (divePlan: DivePlan): DiveProfileInterval[] => {
  const {descentRate, ascentRate} = divePlan

  return reduce(
    (intervalsAcc: DiveProfileInterval[], level: DivePlanLevel) => {
      const {
        endDepth: startDepth = 0,
        endTime: startTime = 0
      } = last(intervalsAcc) ?? {}

      const {
        duration,
        depth: endDepth,
        gasMix
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
        endDepth,
        gasMix
      }

      if (timeDelta >= duration) {
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
        endDepth: deltaInterval.endDepth,
        gasMix
      }

      if(timeDelta === 0) {
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
    divePlan.levels
  )
}
