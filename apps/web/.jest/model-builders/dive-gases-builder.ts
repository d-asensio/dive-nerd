import {GasesState} from "@/state/dive-gases/types";
import {Gas} from "@/utils/types";

export function diveGasesBuilder() {
  const builder = {
    withGases,
    withoutGases,
    build
  }

  let gases: GasesState = {
    gasesMap: {},
    gasesIdList: []
  }

  function withGases(gasesMap: Record<string, Gas>) {
    gases.gasesMap = gasesMap
    gases.gasesIdList = Object.keys(gases.gasesMap)
    return builder
  }

  function withoutGases() {
    gases.gasesMap = {}
    gases.gasesIdList = []
    return builder
  }

  function build() {
    return gases
  }

  return builder
}
