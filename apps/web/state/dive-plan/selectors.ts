import { memoize, memoizeWithArgs } from 'proxy-memoize';

import {DivePlanSlice} from "@/state/dive-plan/slice";
import {DivePlanLevel} from "@/state/dive-plan/types";
import divePlanner, {DiveProfileIntervalType, type DiveSegment} from "dive-planner";
import {StoreState} from "@/state/store";

export const isFirstDiveLevelSelector = memoizeWithArgs<[DivePlanSlice, string], boolean>(
  ({diveLevelsIdList: [firstLevelId]}: DivePlanSlice, diveLevelId: string) =>
    diveLevelId === firstLevelId
)

export const diveLevelByIdSelector = memoizeWithArgs<[DivePlanSlice, string], DivePlanLevel>(
  ({diveLevelsMap}: DivePlanSlice, diveLevelId: string) =>
    diveLevelsMap[diveLevelId] || null
)

export const diveIntervalsSelector = memoize<StoreState, DiveSegment[]>(
  ({
    descentRate,
    ascentRate,
    gradientFactorLow,
    gradientFactorHigh,
    switchAtMod,
    lastStopDepth,
    diveLevelsMap,
    gasesMap,
    gasesIdList
  }: StoreState) =>
    divePlanner.calculateDiveProfileFromPlan({
      descentRate,
      ascentRate,
      gradientFactorLow,
      gradientFactorHigh,
      switchAtMod,
      lastStopDepth,
      availableGases: gasesIdList.map(id => gasesMap[id]).filter(Boolean),
      levels:
        Object.values(diveLevelsMap)
          .map(({gasId, ...diveLevel}) => ({
          ...diveLevel,
          gas: gasesMap[gasId]
        }))
    }).intervals
)

export const totalDecoMinutesSelector = memoize<StoreState, number>(
  (state: StoreState) =>
    diveIntervalsSelector(state)
      .filter(({type}) => type === DiveProfileIntervalType.DECO_STOP)
      .reduce((sum, {initialTime, finalTime}) => sum + (finalTime - initialTime), 0)
)

export interface DiveMetrics {
  totalRunTime: number  // minutes (descent start → surface)
  totalDecoTime: number // minutes (sum of DECO_STOP segments)
  averageDepth: number  // meters (time-weighted across the whole profile)
}

const weightedDepthOf = ({initialDepth, finalDepth, initialTime, finalTime}: DiveSegment): number =>
  ((initialDepth + finalDepth) / 2) * (finalTime - initialTime)

export const diveMetricsSelector = memoize<StoreState, DiveMetrics>(
  (state: StoreState) => {
    const intervals = diveIntervalsSelector(state)
    if (intervals.length === 0) {
      return { totalRunTime: 0, totalDecoTime: 0, averageDepth: 0 }
    }

    const totalRunTime = intervals[intervals.length - 1].finalTime
    const totalDecoTime = totalDecoMinutesSelector(state)
    const weightedDepthSum = intervals.reduce((sum, segment) => sum + weightedDepthOf(segment), 0)
    const averageDepth = totalRunTime > 0 ? weightedDepthSum / totalRunTime : 0

    return { totalRunTime, totalDecoTime, averageDepth }
  }
)

interface DecoStopSummary {
  depth: number
  duration: number
  gasId: string | undefined
}

/**
 * Groups consecutive DECO_STOP segments at the same depth (rare with the
 * current algorithm but cheap insurance) into a single row per stop depth.
 */
export const decoStopsSelector = memoize<StoreState, DecoStopSummary[]>(
  ({gasesMap, ...state}: StoreState) => {
    const intervals = diveIntervalsSelector({gasesMap, ...state} as StoreState)
    const idByGas = new Map(Object.entries(gasesMap).map(([id, gas]) => [gas, id]))

    return intervals
      .filter(({type}) => type === DiveProfileIntervalType.DECO_STOP)
      .reduce<DecoStopSummary[]>((acc, segment) => {
        const duration = segment.finalTime - segment.initialTime
        const previous = acc[acc.length - 1]
        if (previous && previous.depth === segment.finalDepth) {
          previous.duration += duration
          return acc
        }
        return [...acc, {
          depth: segment.finalDepth,
          duration,
          gasId: idByGas.get(segment.gas)
        }]
      }, [])
  }
)

