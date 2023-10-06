import { memoizeWithArgs } from 'proxy-memoize';

import {DivePlanSlice} from "@/state/dive-plan/slice";
import {DivePlanLevel} from "@/state/dive-plan/types";

export const isFirstDiveLevelSelector = memoizeWithArgs<[DivePlanSlice, string], boolean>(
  ({diveLevelsIdList: [firstLevelId]}: DivePlanSlice, diveLevelId: string) =>
    diveLevelId === firstLevelId
)

export const diveLevelByIdSelector = memoizeWithArgs<[DivePlanSlice, string], DivePlanLevel>(
  ({diveLevelsMap}: DivePlanSlice, diveLevelId: string) =>
    diveLevelsMap[diveLevelId] || null
)

