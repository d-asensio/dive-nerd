/**
 * Tolerated ambient pressure for a single compartment under a given
 * gradient factor.
 *
 * See `spec/buhlmann-16-zhl.md` §7.
 *
 *     P_amb,tol(GF) = (P_t − GF · a) / (GF/b + 1 − GF)
 *
 * Where `P_t` is the total inert tissue tension (N2 + He) and `(a, b)` are
 * the coupled coefficients of the compartment (see
 * `coupled-buhlmann-coefficients`).
 *
 * The returned value is the **raw mathematical tolerated ambient pressure**
 * and can be below the surface ambient pressure (or even negative for very
 * empty / fast compartments). Clamping the ceiling against the surface is
 * intentionally left to the dive planner — it is an environmental concern,
 * not a physical one.
 */
import { coupledBuhlmannCoefficients } from './coupled-buhlmann-coefficients'

interface CompartmentInertLoad {
  nitrogenPartialPressure: number
  heliumPartialPressure: number
}

interface BuhlmannCoefficients {
  a: number
  b: number
}

interface CompartmentBuhlmannCoefficients {
  nitrogen: BuhlmannCoefficients
  helium: BuhlmannCoefficients
}

const totalInertTension = ({
  nitrogenPartialPressure: pN2,
  heliumPartialPressure: pHe
}: CompartmentInertLoad): number =>
  pN2 + pHe

export const compartmentCeilingAmbientPressure = ({
  inertLoad,
  coefficients,
  gradientFactor
}: {
  inertLoad: CompartmentInertLoad
  coefficients: CompartmentBuhlmannCoefficients
  gradientFactor: number
}): number => {
  const { a, b } = coupledBuhlmannCoefficients({ inertLoad, coefficients })
  const totalTension = totalInertTension(inertLoad)

  const denominator = gradientFactor / b + 1 - gradientFactor

  return (totalTension - gradientFactor * a) / denominator
}
