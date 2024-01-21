import {Gas} from "@/utils/types";

export function gasBuilder() {
  const builder = {
    asADecoGas,
    asABottomGas,
    withFractions,
    build
  }

  let gas: Gas = {
    isDecoGas: false,
    fO2: 0.21,
    fHe: 0
  }

  function withFractions(gasFractions: Partial<Pick<Gas, 'fO2' | 'fHe'>>) {
    gas = {...gas, ...gasFractions}
    return builder
  }

  function asADecoGas() {
    gas.isDecoGas = true
    return builder
  }

  function asABottomGas() {
    gas.isDecoGas = false
    return builder
  }

  function build() {
    return Object.assign({}, gas)
  }

  return builder
}
