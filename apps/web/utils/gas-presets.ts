import { Gas } from "@/utils/types";

/**
 * Standardised "DIR" gas sets published by the major technical-diving
 * agencies. Each gas is encoded by its oxygen/helium fractions; the display
 * name (e.g. "Nitrox 32", "Trimix 18/45") is derived by the gas formatter, so
 * helium mixes with fO2 ≥ 19% render as "Helitrox" per the app convention.
 *
 * IANTD is intentionally omitted: it imposes no fixed standard gases ("best
 * mix" philosophy), only a deco-gas convention.
 */
export interface AgencyGasPreset {
  agency: string
  bottom: Gas[]
  deco: Gas[]
}

const bottom = (fO2: number, fHe: number): Gas => ({ isDecoGas: false, fO2, fHe })
const deco = (fO2: number, fHe: number): Gas => ({ isDecoGas: true, fO2, fHe })

export const agencyGasPresets: AgencyGasPreset[] = [
  {
    agency: 'UTD',
    bottom: [
      bottom(0.21, 0),     // Air
      bottom(0.32, 0),     // Nitrox 32
      bottom(0.30, 0),     // Nitrox 30
      bottom(0.25, 0.25),  // Trimix 25/25
      bottom(0.21, 0.35),  // Trimix 21/35
      bottom(0.18, 0.45),  // Trimix 18/45
      bottom(0.15, 0.55),  // Trimix 15/55
      bottom(0.12, 0.60),  // Trimix 12/60
      bottom(0.10, 0.70),  // Trimix 10/70
    ],
    deco: [
      deco(1, 0),        // Oxygen
      deco(0.50, 0),     // Nitrox 50
      deco(0.35, 0.25),  // Trimix 35/25
      deco(0.21, 0.35),  // Trimix 21/35
    ],
  },
  {
    agency: 'GUE',
    bottom: [
      bottom(0.21, 0),     // Air
      bottom(0.32, 0),     // Nitrox 32
      bottom(0.30, 0),     // Nitrox 30
      bottom(0.21, 0.35),  // Trimix 21/35
      bottom(0.18, 0.45),  // Trimix 18/45
      bottom(0.15, 0.55),  // Trimix 15/55
      bottom(0.12, 0.65),  // Trimix 12/65
      bottom(0.10, 0.70),  // Trimix 10/70
    ],
    deco: [
      deco(1, 0),        // Oxygen
      deco(0.50, 0),     // Nitrox 50
      deco(0.35, 0.25),  // Trimix 35/25
      deco(0.21, 0.35),  // Trimix 21/35
    ],
  },
  {
    agency: 'TDI',
    bottom: [
      bottom(0.21, 0),     // Air
      bottom(0.32, 0),     // Nitrox 32
      bottom(0.30, 0.30),  // Trimix 30/30
      bottom(0.21, 0.35),  // Trimix 21/35
      bottom(0.18, 0.45),  // Trimix 18/45
      bottom(0.15, 0.55),  // Trimix 15/55
      bottom(0.10, 0.70),  // Trimix 10/70
    ],
    deco: [
      deco(1, 0),     // Oxygen
      deco(0.50, 0),  // Nitrox 50
    ],
  },
]
