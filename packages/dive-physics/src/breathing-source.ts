/**
 * Computes the inspired (alveolar) inert-gas partial pressures driving the
 * Schreiner equation, for either an open circuit (fixed gas mix) or a closed
 * circuit rebreather (constant pO₂ setpoint, with the rest of the loop made up
 * of diluent).
 *
 * The Schreiner integration itself is identical for both circuits — only the
 * inspired inert-gas pressure and its rate of change with ambient pressure
 * differ. This module is the single source of truth for that difference.
 *
 *   OC : inert pp        = (Pa − Pwv) · F_ig
 *        change-rate factor = F_ig
 *   CCR: inert pp        = [f_i / (1 − fO2)] · (Pa − setpoint − Pwv)
 *        change-rate factor = f_i / (1 − fO2)
 *
 * where `f_i` is the inert gas fraction of the **diluent** and `fO2` its oxygen
 * fraction. The factor `f_i/(1−fO2)` is the inert gas's share of the diluent's
 * non-oxygen part; for an air diluent it is 1, so the CCR inert pressure
 * reduces to `Pa − setpoint − Pwv`.
 *
 * The CCR model is only physical while the loop can sustain the setpoint
 * (`Pa > setpoint + Pwv`). Shallower than that the inert pressure clamps to 0
 * and `setpointUnsustainable` is set so callers can warn.
 *
 * The returned `*ChangeRateFactor`s are just the per-gas fractions; multiply by
 * the ambient-pressure change rate to get the Schreiner `R` term — see
 * `inspiredGasChangeRate` for the OC equivalent (`R · Fig`).
 *
 * All pressures in bar. See `docs/superpowers/specs/2026-06-02-ccr-decompression-design.md`.
 */
export type Circuit = 'OC' | 'CCR'

interface InspiredInertGas {
  nitrogen: number
  helium: number
  nitrogenChangeRateFactor: number
  heliumChangeRateFactor: number
  setpointUnsustainable: boolean
}

export const inspiredInertGas = ({
  circuit,
  ambientPressure: Pa,
  waterVaporPressure: Pwv,
  gas,
  setpoint
}: {
  circuit: Circuit
  ambientPressure: number
  waterVaporPressure: number
  gas: { fO2: number; fHe: number }
  setpoint?: number
}): InspiredInertGas => {
  const nitrogenFractionOfGas = 1 - gas.fO2 - gas.fHe
  const heliumFractionOfGas = gas.fHe

  if (circuit === 'OC') {
    const inspired = Pa - Pwv
    return {
      nitrogen: inspired * nitrogenFractionOfGas,
      helium: inspired * heliumFractionOfGas,
      nitrogenChangeRateFactor: nitrogenFractionOfGas,
      heliumChangeRateFactor: heliumFractionOfGas,
      setpointUnsustainable: false
    }
  }

  const sp = setpoint ?? 0
  const nonOxygenFraction = 1 - gas.fO2
  const nitrogenFactor = nonOxygenFraction > 0 ? nitrogenFractionOfGas / nonOxygenFraction : 0
  const heliumFactor = nonOxygenFraction > 0 ? heliumFractionOfGas / nonOxygenFraction : 0

  const inertSupplyPressure = Pa - sp - Pwv
  const setpointUnsustainable = inertSupplyPressure <= 0
  const base = setpointUnsustainable ? 0 : inertSupplyPressure

  return {
    nitrogen: nitrogenFactor * base,
    helium: heliumFactor * base,
    nitrogenChangeRateFactor: nitrogenFactor,
    heliumChangeRateFactor: heliumFactor,
    setpointUnsustainable
  }
}
