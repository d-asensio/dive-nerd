import { memoizeWithArgs } from 'proxy-memoize';

import {GasesSlice} from "@/state/dive-gases/slice";
import {GasMix} from "@/utils/types";

export const isFirstMixSelector = memoizeWithArgs<[GasesSlice, string], boolean>(
  ({mixesIdList: [firstMixId]}: GasesSlice, mixId: string) =>
    mixId === firstMixId
)

export const mixByIdSelector = memoizeWithArgs<[GasesSlice, string], GasMix>(
  ({mixesMap}: GasesSlice, mixId: string) =>
    mixesMap[mixId] || null
)

