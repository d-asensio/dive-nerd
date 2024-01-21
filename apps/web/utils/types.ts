export interface Gas {
  isDecoGas: boolean
  fO2: number
  fHe: number
}

export enum GasType {
  AIR = 'air',
  NITROX = 'nitrox',
  HELITROX = 'helitrox',
  TRIMIX = 'trimix',
  HELIOX = 'heliox',
  OXYGEN = 'oxygen',
  IMPOSSIBLE_MIX = 'impossible_mix'
}
