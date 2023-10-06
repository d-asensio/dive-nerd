export interface GasMix {
  fO2: number
  fHe: number
}

export enum GasMixType {
  AIR = 'air',
  NITROX = 'nitrox',
  HELITROX = 'helitrox',
  TRIMIX = 'trimix',
  HELIOX = 'heliox',
  OXYGEN = 'oxygen',
  IMPOSSIBLE_MIX = 'impossible_mix'
}
