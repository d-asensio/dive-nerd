import {Gas} from "@/utils/types";

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

export const maximumOperatingDepth = ({ isDecoGas, fO2 }: Pick<Gas, 'fO2' | 'isDecoGas'>) => {
  const ppO2max = isDecoGas ? 1.6 : 1.2
  const maxAmbientPressure = ambientPressureOfFractionPartialPressure(ppO2max, fO2)
  const depth = fromPressureToDepth({
    pressure: maxAmbientPressure,
    surfaceAmbientPressure,
    waterDensity
  })

  return nearestMultipleOfThree(depth)
}
