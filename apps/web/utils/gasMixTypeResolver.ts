import {GasMix, GasMixType} from "@/utils/types";

export const gasMixTypeResolver = {
  resolve: ({fO2, fHe}: GasMix) => {
    if (fO2 > .92) return GasMixType.OXYGEN

    if (fHe + fO2 === 1) return GasMixType.HELIOX
    if (fHe > 0 && fO2 < .19) return GasMixType.TRIMIX
    if (fHe > 0) return GasMixType.HELITROX

    if (fO2 > .21) return GasMixType.NITROX

    return GasMixType.AIR
  }
}
