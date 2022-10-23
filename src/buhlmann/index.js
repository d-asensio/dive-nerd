import { divide, last, map, multiply, subtract, pipe, reduce, __ } from 'ramda'
import compartments from './compartments'

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

/**
 * Utility functions
 */
const fromPascalsToBars = divide(__, 100000)

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
    compartments
  )
}

const calculateAbmientPressure = ([startSample, endSample]) => {
  const { depth } = endSample

  const waterPressurePascals = depth * waterDensity * GRAVITY
  const waterPressure = fromPascalsToBars(waterPressurePascals)

  return [
    startSample,
    {
      ...endSample,
      ambientPressure: waterPressure + surfacePressure
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
            comparmentDecayConstant: compartments[index].N2.k,
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

const calculateCompartmentCeiling = ([startSample, endSample]) => {
  return [
    startSample,
    {
      ...endSample,
      compartments: endSample.compartments.map((compartment, index) => {
        const { max } = Math
        const { pressureLoadN2 } = compartment
        const { N2, He } = compartments[index]
        const pressureLoadHe = 0

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

        const ceiling =
          (pressureLoadN2 + pressureLoadHe - coefficientA) * coefficientB

        return {
          ...compartment,
          ceiling: max(0, ceiling)
        }
      })
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
