export  { buhlmannCompartments } from './buhlmannCompartments'

/**
 * Gravitational acceleration in meters * second^2
 */
const GRAVITY = 9.80665

const AIR_NITROGEN_FRACTION = 0.79

export interface CompartmentInertGasLoad {
  N2: number
  He: number
}

/**
 * Calculates the gas load saturation for the provided compartments at a
 * specified surface ambient pressure (at sea level, or at height), taking into
 * account the gas fractions of atmospheric air (21% O2, 79% N2).
 *
 * This function can be particularly useful for initializing the compartments
 * before a "first dive", in which the diver haven't been diving for a
 * relatively long period of time.
 */
export const getSurfaceSaturatedCompartmentInertGasLoads = ({
  surfaceAmbientPressure: Ps,
  waterVaporPressure: Pwv
}: {
  surfaceAmbientPressure: number,
  waterVaporPressure: number
}): CompartmentInertGasLoad[] =>
  Array.from({ length: 16 }).map(() => ({
    N2: (Ps - Pwv) * AIR_NITROGEN_FRACTION,
    He: 0
  }))

/**
 * Calculates the inspired gas change rate for an inert gas fraction.
 *
 * This function can be used with any pressure units (pascal/second, bar/min,
 * msw/min, fsw/min, etc.).
 */
export const inspiredGasChangeRate = ({
  descentRate: R,
  inertGasFraction: Fig
}: {
  descentRate: number,
  inertGasFraction: number
}): number =>
  R*Fig

/**
 * Calculates the water pressure in the alveoli. It uses the alveolar
 * ventilation equation.
 *
 * There are various possible values for the respiratory quotient, it is a
 * correction that varies depending on the modeler. Some are more
 * conservative than others:
 * - Schreiner: 0.8 (most conservative)
 * - Workman (U.S. Navy): 0.9
 * - Bühlmann: 1.0 (least conservative)
 *
 * Standard values for carbon dioxide pressure and water pressure are 40 mm Hg
 * and 47 mm Hg respectively. For more information about the formula and the
 * reasoning behind these values check out
 * [this paper](https://journals.physiology.org/doi/epdf/10.1152/advan.00064.2019)
 *
 * This function can be used with any pressure units (pascal, mm Hg, bar, msw,
 * fsw), the only requirement is to be consistent in all the provided pressure
 * parameters.
 */
export const alveolarWaterVaporPressure = ({
  respiratoryQuotient: Rq,
  carbonDioxidePressure: Pco2,
  waterPressure: Ph2o
}: {
  respiratoryQuotient: number,
  carbonDioxidePressure: number,
  waterPressure: number
}): number =>
  Ph2o - (Pco2*(1 - Rq)/Rq)

/**
 * Calculates the alveolar partial pressure of an inert gas. This is the
 * inspired partial pressure of the gas minus the water vapour pressure in the
 * lungs, which is considered constant.
 *
 * This function can be used with any pressure units (pascal, mm Hg, bar, msw,
 * fsw), the only requirement is to be consistent in all the provided pressure
 * parameters.
 */
export const alveolarInertGasPartialPressure = ({
  ambientPressure: Pa,
  waterVaporPressure: Pwv,
  inertGasFraction: Fig
}: {
  ambientPressure: number,
  waterVaporPressure: number,
  inertGasFraction: number
}): number =>
  (Pa - Pwv)*Fig

/**
 * Calculates the time constant given an inert gas half-time. The half-time must
 * be in minutes.
 *
 * For more information about the half-time (or half-life as it is called in
 * physics) check [this wikipedia article](https://en.wikipedia.org/wiki/Half-life#:~:text=Half%2Dlife%20(symbol%20t%C2%BD,how%20long%20stable%20atoms%20survive.)
 */
export const inertGasTimeConstant = ({
  inertGasHalfTime: T2ig
}: {
  inertGasHalfTime: number
}): number =>
  Math.LN2/T2ig

/**
 * Calculates the total partial pressure of an inert gas in a compartment for a
 * specific interval.
 *
 * The intervalTime must be in minutes, the pressure units for
 * initialInspiredGasPartialPressure and initialCompartmentGasPartialPressure
 * must be consistent (bar, fsw, msw, pascal, etc.) and the gasChangeRate must
 * be in <pressure_units>/minute
 */
export const schreinerEquation = ({
  initialAlveolarGasPartialPressure: Pig,
  initialCompartmentGasPartialPressure: Pcg,
  gasTimeConstant: k,
  gasChangeRate: R,
  intervalTime: t
}: {
  initialAlveolarGasPartialPressure: number,
  initialCompartmentGasPartialPressure: number,
  gasTimeConstant: number,
  gasChangeRate: number,
  intervalTime: number
}): number =>
  Pig + R*(t - 1/k) - (Pig - Pcg - R/k)*Math.exp(-k*t)


const fromPascalsToBars: (pascals: number) => number =
  pascals => pascals / 100000

export const fromDepthToHydrostaticPressure = ({
   depth: D,
   surfaceAmbientPressure: Ps,
   waterDensity: Wd
 }: {
  depth: number,
  surfaceAmbientPressure: number,
  waterDensity: number
}) => fromPascalsToBars(D * Wd * GRAVITY) + Ps
