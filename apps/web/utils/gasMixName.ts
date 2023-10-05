interface GasMix {
  fO2: number
  fHe: number
}

export enum GasMixName {
  AIR = 'air',
  NITROX = 'nitrox',
  HELITROX = 'helitrox',
  TRIMIX = 'trimix',
  HELIOX = 'heliox',
  OXYGEN = 'oxygen'
}

export const gasMixName = ({fO2, fHe}: GasMix) => {
  if (fHe + fO2 === 1) return GasMixName.HELIOX
  if (fHe > 0 && fO2 < .19) return GasMixName.TRIMIX
  if (fHe > 0) return GasMixName.HELITROX

  if (fO2 > .92) return GasMixName.OXYGEN
  if (fO2 > .21) return GasMixName.NITROX

  return GasMixName.AIR
}
