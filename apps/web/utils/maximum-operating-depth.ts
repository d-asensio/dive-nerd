const GRAVITY = 9.80665
const surfaceAmbientPressure = 1.0133 // bar
const waterDensity = 1023.6 // kg/m3

const ambientPressureOfFractionPartialPressure =
  (ppGas: number, fGas: number) =>
    ppGas / fGas


const fromBarsToPascals = (bars: number) => bars * 100000

const fromPressureToDepth = ({
  surfaceAmbientPressure: Ps,
  pressure: P,
  waterDensity: Wd
}: {
  surfaceAmbientPressure: number,
  pressure: number,
  waterDensity: number
}) => fromBarsToPascals(P - Ps) / (Wd * GRAVITY)

function nearestMultipleOfThree(num: number): number {
  const remainder = num % 3;
  const closestLowerMultiple = num - remainder;
  const closestHigherMultiple = closestLowerMultiple + 3;

  if (remainder < 1.5) {
    return closestLowerMultiple;
  } else {
    return closestHigherMultiple;
  }
}

export const maximumOperatingDepth = ({fO2}: { fO2: number }) => {
  const maxAmbientPressure = ambientPressureOfFractionPartialPressure(1.6, fO2)
  const depth = fromPressureToDepth({
    pressure: maxAmbientPressure,
    surfaceAmbientPressure,
    waterDensity
  })

  return nearestMultipleOfThree(depth)
}
