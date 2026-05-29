/**
 * Gas density (g/L) for a breathing mix at a given ambient pressure, derived
 * from the ideal gas law:
 *
 *   ρ = P · M / (R · T)
 *
 * where M is the mixture's average molar mass — computed from the oxygen and
 * helium fractions (with nitrogen filling the remainder) — R is the universal
 * gas constant and T the temperature.
 *
 * Inputs use the same conventions as the rest of this package: pressure in
 * bar, temperature in kelvin. The default temperature is 293.15 K (20 °C), a
 * common reference for diving gas-density tables (GUE/density-as-deco etc.).
 *
 * Reference density of dry air at 1 bar / 20 °C is ≈ 1.2 g/L.
 */
const OXYGEN_MOLAR_MASS = 31.998    // g/mol
const HELIUM_MOLAR_MASS = 4.003     // g/mol
const NITROGEN_MOLAR_MASS = 28.014  // g/mol
const GAS_CONSTANT = 0.083145       // L·bar / (mol·K)
const DEFAULT_TEMPERATURE_K = 293.15

export const gasDensity = ({
  oxygenFraction: fO2,
  heliumFraction: fHe,
  ambientPressure: Pa,
  temperature: T = DEFAULT_TEMPERATURE_K,
}: {
  oxygenFraction: number
  heliumFraction: number
  ambientPressure: number
  temperature?: number
}): number => {
  const fN2 = 1 - fO2 - fHe
  const molarMass =
    fO2 * OXYGEN_MOLAR_MASS +
    fHe * HELIUM_MOLAR_MASS +
    fN2 * NITROGEN_MOLAR_MASS
  return (Pa * molarMass) / (GAS_CONSTANT * T)
}
