import { gasTypeResolver as defaultGasNameResolver } from "@/utils/gas-type-resolver";
import {Gas, GasType} from "@/utils/types";

interface Dependencies {
  gasNameResolver?: typeof defaultGasNameResolver
}

export const createGasFormatter = (dependencies: Dependencies = {}) => {
  const {
    gasNameResolver = defaultGasNameResolver
  } = dependencies

  function capitalize(word: string) {
    return `${word.charAt(0).toUpperCase()}${word.slice(1)}`
  }

  const formatGasFraction = (gasFraction: number) =>
    Math.trunc(gasFraction * 100)

  function format(gas: Gas) {
    const gasName = gasNameResolver.resolve(gas)

    if ([GasType.IMPOSSIBLE_MIX].includes(gasName)) return 'Impossible Mix'
    if ([GasType.OXYGEN, GasType.AIR].includes(gasName)) return `${capitalize(gasName)}`
    if (gasName === GasType.NITROX) return `${capitalize(gasName)} ${formatGasFraction(gas.fO2)}`

    return `${capitalize(gasName)} ${formatGasFraction(gas.fO2)}/${formatGasFraction(gas.fHe)}`
  }

  return {format}
}

export const gasFormatter = createGasFormatter()
