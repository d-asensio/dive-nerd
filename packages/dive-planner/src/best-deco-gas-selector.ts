/**
 * Picks the most aggressive deco gas safe to breathe at a given depth.
 *
 * Selection rule (see `spec/buhlmann-16-zhl.md` §9):
 * - Consider only gases marked `isDecoGas: true`.
 * - Keep those whose Maximum Operating Depth at the configured `ppO2Max`
 *   is at or below the current depth (i.e. safe to breathe here).
 * - Among the remaining, pick the one with the highest `fO2` (richest →
 *   fastest off-gassing).
 * - If none qualifies, fall back to the back gas.
 *
 * **Grid tolerance**: deco stops happen on a 3 m grid, so the relevant
 * comparison is between the stop ambient pressure and the gas's MOD at the
 * configured `ppO2Max`. To match universal diving convention — "O₂ at 6 m,
 * EAN50 at 21 m" — we accept a tiny ppO₂ slack (`ppO2Tolerance`, default
 * 0.02 bar) that absorbs the difference between the mathematical MOD and
 * the nearest 3 m stop. Without it, breathing pure O₂ at the 6 m stop
 * would be rejected by ~0.016 bar.
 */
import { Gas } from './types'

const DEFAULT_DECO_PPO2_MAX = 1.6 // bar
const DEFAULT_PPO2_TOLERANCE = 0.02 // bar (≈ 20 cm of seawater)

interface BestDecoGasSelectorOptions {
  ppO2Max?: number
  ppO2Tolerance?: number
}

const ambientPressureForPpO2 = (ppO2Max: number, fO2: number): number => ppO2Max / fO2

export const createBestDecoGasSelector = ({
  ppO2Max = DEFAULT_DECO_PPO2_MAX,
  ppO2Tolerance = DEFAULT_PPO2_TOLERANCE
}: BestDecoGasSelectorOptions = {}) => {
  const effectivePpO2Max = ppO2Max + ppO2Tolerance

  const isSafeAt = (gas: Gas, ambientPressure: number): boolean =>
    ambientPressure <= ambientPressureForPpO2(effectivePpO2Max, gas.fO2)

  const richerThan = (a: Gas, b: Gas): boolean => a.fO2 > b.fO2

  const select = ({
    availableGases,
    backGas,
    ambientPressure
  }: {
    availableGases: Gas[]
    backGas: Gas
    ambientPressure: number
  }): Gas => {
    const candidates = availableGases.filter(gas => gas.isDecoGas && isSafeAt(gas, ambientPressure))

    if (candidates.length === 0) return backGas

    return candidates.reduce((best, candidate) => (richerThan(candidate, best) ? candidate : best))
  }

  return { select }
}

export type BestDecoGasSelector = ReturnType<typeof createBestDecoGasSelector>
