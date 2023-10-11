import {last, reduce} from "ramda";

export interface DiveProfileIntervalDeprecated {
  type: DiveProfileIntervalType
  initialTime: number
  finalTime: number
  initialDepth: number
  finalDepth: number
  gas: Gas
}

// ####

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
  // gradientFactors: [number, number]
  levels: DivePlanLevel[]
}

export enum DiveProfileIntervalType {
  DESCENT = 'DESCENT',
  NAVIGATION = 'NAVIGATION',
  ASCENT = 'ASCENT',
  DECO_STOP = 'DECO_STOP'
}

interface InertGasPartialPressures {
  ppN2: number
  ppHe: number
}

interface DiveProfileInterval {
  type: DiveProfileIntervalType

  duration: number // minutes
  depth: number // meters
  isGasSwitched: boolean
  gas: Gas

  ambientPressure: number // bars
  compartmentInertGasPartialPressures: InertGasPartialPressures[] // bars
  ceilingDepth: number // meters
}

interface DiveProfile {
  // runTime: number
  // decoTime: number
  // averageDepth: number
  // intervals: DiveProfileInterval[]
  intervals: DiveSegment[]
}

interface DiveSegment {
  type: DiveProfileIntervalType
  initialDepth: number
  finalDepth: number
  initialTime: number
  finalTime: number
  gas: Gas
}

// interface DecompressionAlgorithm {
//   calculateDiveProfileFromSegments: (segments: DiveSegment) => DiveProfile
// }

interface DivePlannerDependencies {
  // decompressionAlgorithm: DecompressionAlgorithm
}

interface DivePlanner {
  calculateDiveProfileFromPlanV1: (configuration: DivePlan) => DiveSegment[]
}

export const createDivePlanner = (dependencies: DivePlannerDependencies): DivePlanner => {

  const calculateDiveProfileFromPlanV1 = ({descentRate, ascentRate, levels} : DivePlan): DiveSegment[] =>
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
      levels
    )

  return {
    calculateDiveProfileFromPlanV1
  }
}

export default createDivePlanner({})
