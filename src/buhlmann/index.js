import { last, map, pipe, reduce } from 'ramda'
import compartments from './compartments'

/**
 * TODO: Validate this constant. Does this change at different ambient pressure (depth)?
 */
const WATER_VAPOUR_PARTIAL_PRESSURE = 0.0567

export const getInitialCompartmentsGas = () => {
  const surface_pressure_in_bars = 1
  const air_nitrogen_partial_pressure = 0.79

  return map(
    ({ id }) => ({
      id,
      gas_pressure:
        air_nitrogen_partial_pressure *
        (surface_pressure_in_bars - WATER_VAPOUR_PARTIAL_PRESSURE)
    }),
    compartments
  )
}

const calculateAbmientPressure = ([startSample, endSample]) => {
  const { depth } = endSample

  const surface_pressure_in_bars = 1
  // const fresh_water_density = 997.0474
  const salt_water_density = 1023.6 // kg/m^3 (in salty water) TODO: account for temperature?
  const gravity = 9.8 // m*s^2
  const pressure_in_pascals = depth * salt_water_density * gravity
  const pressure_in_bars = pressure_in_pascals / 100000

  return [
    startSample,
    {
      ...endSample,
      ambientPressure: pressure_in_bars + surface_pressure_in_bars
    }
  ]
}

const calculatePartialPressureO2 = ([startSample, endSample]) => {
  const { ambientPressure, gasMixtures } = endSample

  return [
    startSample,
    {
      ...endSample,
      partialPressureO2: ambientPressure * gasMixtures.oxygen
    }
  ]
}

const calculatePartialPressureN2 = ([startSample, endSample]) => {
  const { ambientPressure, gasMixtures } = endSample

  const surface_pressure_in_bars = 1

  return [
    startSample,
    {
      ...endSample,
      partialPressureN2:
        ambientPressure *
        gasMixtures.nitrogen *
        (surface_pressure_in_bars - WATER_VAPOUR_PARTIAL_PRESSURE)
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
    depth_delta: endSample.depth - startSample?.depth || 0
  }
]

const calculateAmbientPressureDelta = ([startSample, endSample]) => [
  startSample,
  {
    ...endSample,
    ambient_pressure_delta:
      endSample.ambientPressure - startSample?.ambientPressure || 0
  }
]

const calculateBarsPerMinutDescentRate = ([startSample, endSample]) => {
  const { timeDelta, ambient_pressure_delta } = endSample
  return [
    startSample,
    {
      ...endSample,
      descent_rate: (ambient_pressure_delta / timeDelta) * 60 || 0
    }
  ]
}

const calculateCompartmentGasLoad = ([startSample, endSample]) => {
  const { exp } = Math

  const { descent_rate, timeDelta, partialPressureN2 } = endSample

  const compartments_gas =
    startSample?.compartments ?? getInitialCompartmentsGas()

  const Pio = partialPressureN2

  const R = descent_rate * partialPressureN2
  const t = timeDelta / 60 // In Minutes

  return [
    startSample,
    {
      ...endSample,
      compartments: compartments_gas.map(
        ({ gas_pressure: Po, ...rest }, index) => {
          const k = compartments[index].nitrogen.k
          return {
            ...rest,
            gas_pressure:
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
        const { gas_pressure } = compartment
        const { nitrogen, helium } = compartments[index]
        const pressure_n2 = gas_pressure
        const pressure_he = 0

        const a_n2 = nitrogen.a
        const b_n2 = nitrogen.b
        const a_he = helium.a
        const b_he = helium.b

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

export const calculateDataPoint = pipe(
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

export const calculateDataPointReducer = (acc, currentPoint) => {
  const iterval = [last(acc), currentPoint]

  return [...acc, calculateDataPoint(iterval)]
}

export const calculateDiveProfile = reduce(calculateDataPointReducer, [])
