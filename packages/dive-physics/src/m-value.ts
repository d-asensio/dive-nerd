/**
 * Bühlmann M-value math.
 *
 * For a compartment with coefficients `a` (bar) and `b` (dimensionless) at
 * ambient pressure `Pamb` (bar):
 *
 *     M(Pamb) = a + Pamb / b
 *
 * `M` is the maximum tolerated inert-gas tension in the tissue. Going above
 * `M` is supersaturation beyond Bühlmann's limit.
 *
 * See `spec/buhlmann-16-zhl.md` §4.
 */
export const buhlmannMValue = ({
  coefficientA: a,
  coefficientB: b,
  ambientPressure: Pamb
}: {
  coefficientA: number
  coefficientB: number
  ambientPressure: number
}): number =>
  a + Pamb / b
