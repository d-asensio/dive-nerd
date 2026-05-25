/**
 * Computes the **gas switch depth** of a deco gas: the deepest 3 m stop
 * where the gas is safe to breathe at the configured `ppO2Max`.
 *
 * This is what allows the algorithm to insert a procedural "switch stop"
 * at the MOD of each deco gas, even when Bühlmann's natural ceiling does
 * not require a stop there. Subsurface, MultiDeco and friends all behave
 * this way — it matches diver expectations ("EAN50 at 21 m, O₂ at 6 m").
 *
 * The snap-to-grid convention is **nearest 3 m multiple**, which absorbs
 * the tiny ppO₂ slack at the 6 m boundary (pure O₂ → ~6.06 m strictly
 * snaps to 6 m). For asymmetric gases the rounding follows the same
 * convention as the existing `apps/web/utils/maximum-operating-depth.ts`.
 */
import { DepthPressureConverter } from './depth-pressure-conversion'
import { Gas } from './types'

const STOP_GRID_METERS = 3
const DEFAULT_PPO2_MAX = 1.6

const snapToGrid = (depth: number): number => Math.round(depth / STOP_GRID_METERS) * STOP_GRID_METERS

interface GasSwitchDepthCalculatorOptions {
  ppO2Max?: number
}

export const createGasSwitchDepthCalculator = ({
  depthPressureConverter,
  options = {}
}: {
  depthPressureConverter: DepthPressureConverter
  options?: GasSwitchDepthCalculatorOptions
}) => {
  const ppO2Max = options.ppO2Max ?? DEFAULT_PPO2_MAX

  const switchDepthOf = (gas: Gas): number => {
    const modAmbientPressure = ppO2Max / gas.fO2
    const modDepth = depthPressureConverter.ambientPressureToDepth(modAmbientPressure)
    return Math.max(0, snapToGrid(modDepth))
  }

  const switchDepthsOf = (availableGases: Gas[]): number[] =>
    availableGases.filter(gas => gas.isDecoGas).map(switchDepthOf)

  return { switchDepthOf, switchDepthsOf }
}

export type GasSwitchDepthCalculator = ReturnType<typeof createGasSwitchDepthCalculator>
