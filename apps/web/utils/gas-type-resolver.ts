import {Gas, GasType} from "@/utils/types";

export const gasTypeResolver = {
  resolve: ({fO2, fHe}: Gas) => {
    if (fHe + fO2 > 1) return GasType.IMPOSSIBLE_MIX

    if (fO2 > .92) return GasType.OXYGEN

    if (fHe + fO2 === 1) return GasType.HELIOX
    if (fHe > 0 && fO2 < .19) return GasType.TRIMIX
    if (fHe > 0) return GasType.HELITROX

    if (fO2 > .21) return GasType.NITROX

    return GasType.AIR
  }
}
