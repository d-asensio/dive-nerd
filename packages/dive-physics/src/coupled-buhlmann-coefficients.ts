/**
 * Combines the per-gas Bühlmann coefficients of N2 and He into a single pair
 * of coefficients, weighted by their partial pressures in the compartment.
 *
 * See `spec/buhlmann-16-zhl.md` §5.
 *
 * When both inert tensions are zero the compartment is empty (or pure O2
 * breathing on the surface, a degenerate case). We default to the N2
 * coefficients in that situation; the ceiling at zero tension will be below
 * the surface anyway so the choice has no operational impact.
 */
interface BuhlmannCoefficients {
  a: number
  b: number
}

interface CompartmentInertLoad {
  nitrogenPartialPressure: number
  heliumPartialPressure: number
}

interface CompartmentBuhlmannCoefficients {
  nitrogen: BuhlmannCoefficients
  helium: BuhlmannCoefficients
}

const isEmpty = ({ nitrogenPartialPressure: pN2, heliumPartialPressure: pHe }: CompartmentInertLoad): boolean =>
  pN2 + pHe === 0

export const coupledBuhlmannCoefficients = ({
  inertLoad,
  coefficients
}: {
  inertLoad: CompartmentInertLoad
  coefficients: CompartmentBuhlmannCoefficients
}): BuhlmannCoefficients => {
  if (isEmpty(inertLoad)) return coefficients.nitrogen

  const { nitrogenPartialPressure: pN2, heliumPartialPressure: pHe } = inertLoad
  const totalInert = pN2 + pHe

  return {
    a: (coefficients.nitrogen.a * pN2 + coefficients.helium.a * pHe) / totalInert,
    b: (coefficients.nitrogen.b * pN2 + coefficients.helium.b * pHe) / totalInert
  }
}
