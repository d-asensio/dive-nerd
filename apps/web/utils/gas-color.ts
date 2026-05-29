import {Gas, GasType} from "@/utils/types"
import {gasTypeResolver} from "@/utils/gas-type-resolver"

/**
 * Hex colour for each gas type, mirroring the Tailwind palette used by
 * `GasBadge` so chart annotations (gas-switch markers, …) match the badges.
 */
const colorByGasType: Record<GasType, string> = {
  [GasType.AIR]:            "#fbbf24", // amber-400
  [GasType.NITROX]:         "#fb923c", // orange-400
  [GasType.HELITROX]:       "#818cf8", // indigo-400
  [GasType.TRIMIX]:         "#4f46e5", // indigo-600
  [GasType.HELIOX]:         "#0d9488", // teal-600
  [GasType.OXYGEN]:         "#4ade80", // green-400
  [GasType.IMPOSSIBLE_MIX]: "#f87171", // red-400
}

export const gasColorOf = (gas: Gas): string =>
  colorByGasType[gasTypeResolver.resolve(gas)]
