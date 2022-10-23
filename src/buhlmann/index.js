import { divide, last, map, pipe, reduce, __ } from 'ramda'
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

export const getInitialCompartmentsGas = () => {
  const air_N2_partial_pressure = 0.79

  return map(
    ({ id }) => ({
      id,
      pressureLoadN2:
        air_N2_partial_pressure *
        (surfacePressure - WATER_VAPOUR_PARTIAL_PRESSURE)
    }),
    compartments
  )
}

const fromPascalsToBars = divide(__, 100000)

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

const calculatePartialPressureO2 = ([startSample, endSample]) => {
  const { ambientPressure, gasMixtures } = endSample

  return [
    startSample,
    {
      ...endSample,
      partialPressureO2: ambientPressure * gasMixtures.O2
    }
  ]
}

const calculatePartialPressureN2 = ([startSample, endSample]) => {
  const { ambientPressure, gasMixtures } = endSample

  return [
    startSample,
    {
      ...endSample,
      partialPressureN2:
        ambientPressure *
        gasMixtures.N2 *
        (surfacePressure - WATER_VAPOUR_PARTIAL_PRESSURE)
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

const calculateCompartmentGasLoad = ([startSample, endSample]) => {
  const { exp } = Math

  const { descentRate, timeDelta, partialPressureN2 } = endSample

  const compartments_gas =
    startSample?.compartments ?? getInitialCompartmentsGas()

  const Pio = partialPressureN2

  const R = descentRate * partialPressureN2
  const t = timeDelta / 60 // In Minutes

  return [
    startSample,
    {
      ...endSample,
      compartments: compartments_gas.map(
        ({ pressureLoadN2: Po, ...rest }, index) => {
          const k = compartments[index].N2.k
          return {
            ...rest,
            pressureLoadN2:
              Pio + R * (t - 1 / k) - (Pio - Po - R / k) * exp(-k * t)
          }
        }
      )
    }
  ]
}

const calculateCompartmentCeiling = ([startSample, endSample]) => {
  return [
    startSample,
    {
      ...endSample,
      compartments: endSample.compartments.map((compartment, index) => {
        const { max } = Math
        const { pressureLoadN2 } = compartment
        const { N2, He } = compartments[index]
        const pressure_n2 = pressureLoadN2
        const pressure_he = 0

        const a_n2 = N2.a
        const b_n2 = N2.b
        const a_he = He.a
        const b_he = He.b

        const a_coefficient =
          (a_n2 * pressure_n2 + a_he * pressure_he) /
          (pressure_n2 + pressure_he)
        const b_coefficient =
          (b_n2 * pressure_n2 + b_he * pressure_he) /
          (pressure_n2 + pressure_he)

        const ceiling =
          (pressure_n2 + pressure_he - a_coefficient) * b_coefficient

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
  calculatePartialPressureO2,
  calculatePartialPressureN2,
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
