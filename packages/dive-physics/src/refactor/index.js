/**
 * Calculates the inspired gas change rate for an inert gas fraction.
 *
 * This function can be used with any pressure units (pascal/second, bar/min,
 * msw/min, fsw/min, etc.).
 *
 * @param R
 * @param Fig
 * @returns {number}
 */
export const inspiredGasChangeRate = ({
  descentRate: R,
  inertGasFraction: Fig
}) => R * Fig

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
 *
 * @param Rq
 * @param Pco2
 * @param Ph2o
 * @returns {number}
 */
export const alveolarWaterVaporPressure = ({
  respiratoryQuotient: Rq,
  carbonDioxidePressure: Pco2,
  waterPressure: Ph2o
}) => Ph2o - (Pco2 * (1 - Rq) / Rq)

/**
 * Calculates the alveolar partial pressure of an inert gas. This is the
 * inspired partial pressure of the gas minus the water vapour pressure in the
 * lungs, which is considered constant.
 *
 * This function can be used with any pressure units (pascal, mm Hg, bar, msw,
 * fsw), the only requirement is to be consistent in all the provided pressure
 * parameters.
 *
 * @param Pa
 * @param Pwv
 * @param Fig
 * @returns {number}
 */
export const alveolarInertGasPartialPressure = ({
  ambientPressure: Pa,
  waterVaporPressure: Pwv,
  inertGasFraction: Fig
}) => (Pa - Pwv) * Fig
