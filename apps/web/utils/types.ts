export interface GasMix {
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
