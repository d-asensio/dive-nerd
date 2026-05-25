/**
 * Diving ceiling across the full 16-compartment set.
 *
 * See `spec/buhlmann-16-zhl.md` §7.
 *
 * The diving ceiling is the **maximum** of the individual compartment
 * ceilings — the diver may only ascend up to the point where the most
 * loaded compartment still tolerates it. This module treats the
 * compartment list as a first-class collection: callers pass the full
 * collection in, and the module is the only place that knows how to
 * reduce it.
 */
import { compartmentCeilingAmbientPressure } from './compartment-ceiling'

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

const ceilingFor = (gradientFactor: number) =>
  (inertLoad: CompartmentInertLoad, coefficients: CompartmentBuhlmannCoefficients): number =>
    compartmentCeilingAmbientPressure({ inertLoad, coefficients, gradientFactor })

export const divingCeilingAmbientPressure = ({
  compartmentLoads,
  compartmentCoefficients,
  gradientFactor
}: {
  compartmentLoads: CompartmentInertLoad[]
  compartmentCoefficients: CompartmentBuhlmannCoefficients[]
  gradientFactor: number
}): number => {
  if (compartmentLoads.length !== compartmentCoefficients.length) {
    throw new Error(
      `Compartment loads (${compartmentLoads.length}) and coefficients (${compartmentCoefficients.length}) must have the same length`
    )
  }

  const ceilingAt = ceilingFor(gradientFactor)

  return compartmentLoads.reduce(
    (maxCeiling, load, index) => Math.max(maxCeiling, ceilingAt(load, compartmentCoefficients[index])),
    Number.NEGATIVE_INFINITY
  )
}
