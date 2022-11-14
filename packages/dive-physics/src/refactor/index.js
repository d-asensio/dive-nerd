export const alveolarWaterVaporPressure = ({
  respiratoryQuotient: Rq,
  carbonDioxidePressure: Pco2,
  waterPressure: Ph2o
}) => -((Pco2 * (1 - Rq)) / Rq) + Ph2o

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
