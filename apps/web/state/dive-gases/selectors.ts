import { memoizeWithArgs } from 'proxy-memoize';

import {GasesSlice} from "@/state/dive-gases/slice";
import {GasMix} from "@/utils/types";
import {maximumOperatingDepth} from "@/utils/maximum-operating-depth";

export const isFirstMixSelector = memoizeWithArgs<[GasesSlice, string], boolean>(
  ({mixesIdList: [firstMixId]}: GasesSlice, mixId: string) =>
    mixId === firstMixId
)

export const mixByIdSelector = memoizeWithArgs<[GasesSlice, string], GasMix>(
  ({mixesMap}: GasesSlice, mixId: string) =>
    mixesMap[mixId] || null
)

export const mixMODSelector = memoizeWithArgs<[GasesSlice, string | undefined], number>(
  ({mixesMap}: GasesSlice, mixId: string | undefined) =>
    mixId && mixesMap[mixId]
      ? maximumOperatingDepth(mixesMap[mixId])
      : Infinity
)

