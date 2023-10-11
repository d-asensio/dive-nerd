import { memoize, memoizeWithArgs } from 'proxy-memoize';

import {DivePlanSlice} from "@/state/dive-plan/slice";
import {DivePlanLevel} from "@/state/dive-plan/types";
import {calculatesIntervalsFromPlan, DiveProfileInterval} from "dive-profile-generator";
import {StoreState} from "@/state/store";

export const isFirstDiveLevelSelector = memoizeWithArgs<[DivePlanSlice, string], boolean>(
  ({diveLevelsIdList: [firstLevelId]}: DivePlanSlice, diveLevelId: string) =>
    diveLevelId === firstLevelId
)

export const diveLevelByIdSelector = memoizeWithArgs<[DivePlanSlice, string], DivePlanLevel>(
  ({diveLevelsMap}: DivePlanSlice, diveLevelId: string) =>
    diveLevelsMap[diveLevelId] || null
)


export const diveIntervalsSelector = memoize<StoreState, DiveProfileInterval[]>(
  ({descentRate, ascentRate, diveLevelsMap, mixesMap}: StoreState) =>
    calculatesIntervalsFromPlan({
      descentRate,
      ascentRate,
      levels:
        Object.values(diveLevelsMap)
          .map(({gasMixId, ...diveLevel}) => ({
          ...diveLevel,
          gasMix: mixesMap[gasMixId]
        }))
    })
)

