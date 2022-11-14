export const alveolarInertGasPartialPressure = ({
  ambientPressure: Pa,
  waterVaporPressure: Pwv,
  inertGasFraction: Fig
}) => (Pa - Pwv) * Fig
