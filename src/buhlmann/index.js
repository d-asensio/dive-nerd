import { divide, last, map, multiply, pipe, reduce, __ } from 'ramda'
import compartmentCoefficients from './compartments'

/**
 * TODO: Validate this constant. Does this change at different ambient pressure (depth)?
 */
const WATER_VAPOUR_PARTIAL_PRESSURE = 0.0567
const GRAVITY = 9.8 // m*s2

/**
 * Dive variables
 */
const surfacePressure = 1 // bar
const waterDensity = 1023.6 // kg/m3
const gradientFactors = [0.3, 0.75]

/**
 * Utility functions
 */
const fromPascalsToBars = divide(__, 100000)
const fromBarsToPascals = multiply(__, 100000)

const fromPressureToDepth = ({
  surfacePressure: Ps,
  waterPressure: Pw,
  waterDensity: Wd
}) => {
  const Pwpas = fromBarsToPascals(Pw - Ps)

  return Pwpas / (Wd * GRAVITY)
}

const fromDepthToPressure = ({
  depth: D,
  surfacePressure: Ps,
  waterDensity: Wd
}) => {
  const Pwpas = D * Wd * GRAVITY

  return fromPascalsToBars(Pwpas) + Ps
}

const inertGasAlveolarPressure = (inertGasFraction, ambientPressure) =>
  inertGasFraction * (ambientPressure - WATER_VAPOUR_PARTIAL_PRESSURE)

export const getInitialCompartmentsGas = () => {
  const initialPartialPressureN2 = 0.79

  return map(
    ({ id }) => ({
      id,
      pressureLoadN2: inertGasAlveolarPressure(
        initialPartialPressureN2,
        surfacePressure
      )
    }),
    compartmentCoefficients
  )
}

const calculateAbmientPressure = ([startSample, endSample]) => {
  const { depth } = endSample

  return [
    startSample,
    {
      ...endSample,
      ambientPressure: fromDepthToPressure({
        depth,
        waterDensity,
        surfacePressure
      })
    }
  ]
}

const calculateAlveolarPressureN2 = ([startSample, endSample]) => {
  const { ambientPressure, gasMixtures } = endSample

  return [
    startSample,
    {
      ...endSample,
      alveolarPressureN2: inertGasAlveolarPressure(
        gasMixtures.N2,
        ambientPressure
      )
    }
  ]
}

const calculateTimeDelta = ([startSample, endSample]) => [
  startSample,
  {
    ...endSample,
    timeDelta: endSample.time - startSample?.time || 0
  }
]

const calculateDepthDelta = ([startSample, endSample]) => [
  startSample,
  {
    ...endSample,
    depthDelta: endSample.depth - startSample?.depth || 0
  }
]

const calculateAmbientPressureDelta = ([startSample, endSample]) => [
  startSample,
  {
    ...endSample,
    ambientPressureDelta:
      endSample.ambientPressure - startSample?.ambientPressure || 0
  }
]

const calculateBarsPerMinutDescentRate = ([startSample, endSample]) => {
  const { timeDelta, ambientPressureDelta } = endSample
  return [
    startSample,
    {
      ...endSample,
      descentRate: (ambientPressureDelta / timeDelta) * 60 || 0
    }
  ]
}

const schreinerEquation = ({
  inertGasAlveolarPressure: Palv,
  inertGasPressureRateChange: R,
  timeDelta: t,
  comparmentDecayConstant: k,
  startInertGasCompartmentPressure: Pi
}) => Palv + R * (t - 1 / k) - (Palv - Pi - R / k) * Math.exp(-k * t)

const calculateCompartmentGasLoad = ([startSample, endSample]) => {
  const { descentRate, timeDelta, alveolarPressureN2, gasMixtures } = endSample

  const compartments_gas =
    startSample?.compartments ?? getInitialCompartmentsGas()

  const inertGasPressureRateChange = descentRate * gasMixtures.N2
  const timeDeltaInMinutes = timeDelta / 60 // TODO: Convert everything to minutes

  return [
    startSample,
    {
      ...endSample,
      compartments: compartments_gas.map(
        ({ pressureLoadN2, ...rest }, index) => ({
          ...rest,
          pressureLoadN2: schreinerEquation({
            inertGasAlveolarPressure: alveolarPressureN2,
            inertGasPressureRateChange,
            timeDelta: timeDeltaInMinutes,
            comparmentDecayConstant: compartmentCoefficients[index].N2.k,
            startInertGasCompartmentPressure: pressureLoadN2
          })
        })
      )
    }
  ]
}

const buhlmannCoefficientEquation = ({
  coefficientN2: CN2,
  coefficientHe: CHe,
  startInertGasCompartmentPressureN2: PN2,
  startInertGasCompartmentPressureHe: PHe
}) => (CN2 * PN2 + CHe * PHe) / (PN2 + PHe)

const buhlmannBakerCeilingEquation = ({
  inertGasCompartmentPressure: P,
  coefficientA: A,
  coefficientB: B,
  gradientFactor: gf
}) => (P - A * gf) / (gf / B + 1 - gf)

const calculateCompartmentCeiling = ([startSample, endSample]) => {
  const compartments = endSample.compartments.map((compartment, index) => {
    const { pressureLoadN2, pressureLoadHe = 0 } = compartment
    const { N2, He } = compartmentCoefficients[index]

    const [lowGradientFactor, highGradientFactor] = gradientFactors

    const coefficientA = buhlmannCoefficientEquation({
      coefficientN2: N2.a,
      coefficientHe: He.a,
      startInertGasCompartmentPressureN2: pressureLoadN2,
      startInertGasCompartmentPressureHe: pressureLoadHe
    })

    const coefficientB = buhlmannCoefficientEquation({
      coefficientN2: N2.b,
      coefficientHe: He.b,
      startInertGasCompartmentPressureN2: pressureLoadN2,
      startInertGasCompartmentPressureHe: pressureLoadHe
    })

    const lowCeiling = buhlmannBakerCeilingEquation({
      inertGasCompartmentPressure: pressureLoadN2 + pressureLoadHe,
      coefficientA,
      coefficientB,
      gradientFactor: lowGradientFactor
    })

    const highCeiling = buhlmannBakerCeilingEquation({
      inertGasCompartmentPressure: pressureLoadN2 + pressureLoadHe,
      coefficientA,
      coefficientB,
      gradientFactor: highGradientFactor
    })

    return {
      ...compartment,
      lowCeiling,
      highCeiling
    }
  })

  const { lowCeiling } = reduce(
    (acc, compartment) => {
      if (!acc || compartment.lowCeiling > acc.lowCeiling) return compartment
      return acc
    },
    null,
    compartments
  )

  const { highCeiling } = reduce(
    (acc, compartment) => {
      if (!acc || compartment.highCeiling > acc.highCeiling) return compartment
      return acc
    },
    null,
    compartments
  )

  return [
    startSample,
    {
      ...endSample,
      lowCeiling: fromPressureToDepth({
        waterPressure: lowCeiling,
        waterDensity,
        surfacePressure
      }),
      highCeiling: fromPressureToDepth({
        waterPressure: highCeiling,
        waterDensity,
        surfacePressure
      }),
      compartments
    }
  ]
}

const extactDataPointFromInterval = ([_, endSample]) => endSample

export const calculateDataPointFromInterval = pipe(
  calculateAbmientPressure,
  calculateAlveolarPressureN2,
  calculateAmbientPressureDelta,
  calculateTimeDelta,
  calculateDepthDelta,
  calculateBarsPerMinutDescentRate,
  calculateCompartmentGasLoad,
  calculateCompartmentCeiling,
  extactDataPointFromInterval
)

export const calculateDataPointReducer = (acc, currentPoint) => [
  ...acc,
  calculateDataPointFromInterval([last(acc), currentPoint])
]

export const calculateDiveProfile = reduce(calculateDataPointReducer, [])
