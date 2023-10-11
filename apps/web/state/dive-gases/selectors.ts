import { memoizeWithArgs } from 'proxy-memoize';

import {GasesSlice} from "@/state/dive-gases/slice";
import {Gas} from "@/utils/types";
import {maximumOperatingDepth} from "@/utils/maximum-operating-depth";

export const isFirstGasSelector = memoizeWithArgs<[GasesSlice, string], boolean>(
  ({gasesIdList: [firstGasId]}: GasesSlice, gasId: string) =>
    gasId === firstGasId
)

export const gasByIdSelector = memoizeWithArgs<[GasesSlice, string], Gas>(
  ({gasesMap}: GasesSlice, gasId: string) =>
    gasesMap[gasId] || null
)

export const gasMODSelector = memoizeWithArgs<[GasesSlice, string | undefined], number>(
  ({gasesMap}: GasesSlice, gasId: string | undefined) =>
    gasId && gasesMap[gasId]
      ? maximumOperatingDepth(gasesMap[gasId])
      : Infinity
)

