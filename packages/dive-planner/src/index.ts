import {last, reduce} from "ramda";

export interface Gas {
  fO2: number
  fHe: number
}

interface DivePlanLevel {
  duration: number
  depth: number
  gas: Gas
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
  gas: Gas
}

interface DivePlannerDependencies {}

interface DivePlanner {
  calculateDiveProfileFromPlan: (configuration: DivePlan) => DiveProfileInterval[]
}

export const createDivePlanner = (dependencies: DivePlannerDependencies): DivePlanner => {

  const calculateDiveProfileFromPlan = (divePlan: DivePlan): DiveProfileInterval[] => {
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
          gas
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
          startTime: deltaInterval.endTime,
          endTime: deltaInterval.startTime + duration,
          startDepth: deltaInterval.endDepth,
          endDepth: deltaInterval.endDepth,
          gas
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

  return {
    calculateDiveProfileFromPlan
  }
}

export default createDivePlanner({})
