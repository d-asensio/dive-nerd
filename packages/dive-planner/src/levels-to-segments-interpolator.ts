import {last, reduce} from "ramda";

import {
  DivePlanLevel,
  DivePlanSpeedOptions,
  DiveProfileIntervalType,
  DiveSegment,
  Gas
} from "./types";

interface CircuitInterpolationOptions {
  circuit?: 'OC' | 'CCR'
  diluent?: Gas
  setpointLow?: number
  setpointHigh?: number
}

type InterpolationOptions = DivePlanSpeedOptions & CircuitInterpolationOptions

export const createLevelsToSegmentsInterpolator = () => {
  const interpolate = (
    levels: DivePlanLevel[],
    {descentRate, ascentRate, circuit, diluent, setpointLow, setpointHigh}: InterpolationOptions
  ) => {
    const isCcr = circuit === 'CCR'

    const decorate = (segment: DiveSegment): DiveSegment => {
      if (!isCcr) return segment
      const isAscent = segment.type === DiveProfileIntervalType.ASCENT
      return {
        ...segment,
        gas: diluent ?? segment.gas,
        circuit: 'CCR',
        setpoint: isAscent ? setpointHigh : setpointLow
      }
    }

    return reduce(
      (intervalsAcc: DiveSegment[], level: DivePlanLevel) => {
        const {
          finalDepth: initialDepth = 0,
          finalTime: initialTime = 0
        } = last(intervalsAcc) ?? {}

        const {duration, depth: finalDepth, gas} = level

        const depthDelta = finalDepth - initialDepth
        const rate = depthDelta < 0 ? ascentRate : descentRate
        const deltaIntervalType =
          depthDelta < 0 ? DiveProfileIntervalType.ASCENT : DiveProfileIntervalType.DESCENT
        const timeDelta = Math.abs(depthDelta / rate)

        const deltaInterval = decorate({
          type: deltaIntervalType,
          initialTime,
          finalTime: initialTime + timeDelta,
          initialDepth,
          finalDepth,
          gas
        })

        if (timeDelta >= duration) {
          return [...intervalsAcc, deltaInterval]
        }

        const navigationInterval = decorate({
          type: DiveProfileIntervalType.NAVIGATION,
          initialTime: deltaInterval.finalTime,
          finalTime: deltaInterval.initialTime + duration,
          initialDepth: deltaInterval.finalDepth,
          finalDepth: deltaInterval.finalDepth,
          gas
        })

        if (timeDelta === 0) {
          return [...intervalsAcc, navigationInterval]
        }

        return [...intervalsAcc, deltaInterval, navigationInterval]
      },
      [],
      levels
    )
  }

  return { interpolate }
}
export default createLevelsToSegmentsInterpolator()
