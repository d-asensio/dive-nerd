import { map } from 'ramda'
import { pipeWithArgs } from './pipeWithArgs'
import compartments from './compartments'

/**
 * IDEAS:
 * - Use instantaneous equation to calculate ongass for the first data point
 */

/**
 * TODO: Validate this constant. Does this change at different ambient pressure (depth)?
 */
const WATER_VAPOUR_PARTIAL_PRESSURE = 0.0567

const getInitialCompartmentsGas = () => {
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

const calculateAbmientPressure = data_point => {
  const { depth } = data_point

  const surface_pressure_in_bars = 1
  // const fresh_water_density = 997.0474
  const salt_water_density = 1023.6 // kg/m^3 (in salty water) TODO: account for temperature?
  const gravity = 9.8 // m*s^2
  const pressure_in_pascals = depth * salt_water_density * gravity
  const pressure_in_bars = pressure_in_pascals / 100000

  return {
    ...data_point,
    pressure: pressure_in_bars + surface_pressure_in_bars
  }
}

const calculatePartialPressureO2 = data_point => {
  const { pressure, gas_mixtures } = data_point

  return {
    ...data_point,
    pressureO2: pressure * gas_mixtures.oxygen
  }
}

const calculatePartialPressureN2 = data_point => {
  const { pressure, gas_mixtures } = data_point

  const surface_pressure_in_bars = 1

  return {
    ...data_point,
    pressureN:
      pressure *
      gas_mixtures.nitrogen *
      (surface_pressure_in_bars - WATER_VAPOUR_PARTIAL_PRESSURE)
  }
}

const calculateTimeDelta = (data_point, index, samples) => ({
  ...data_point,
  time_delta: samples[index - 1] ? data_point.time - samples[index - 1].time : 0
})

const calculateDepthDelta = (data_point, index, samples) => ({
  ...data_point,
  depth_delta: samples[index - 1]
    ? data_point.depth - samples[index - 1].depth
    : 0
})

const calculateDescentRate = data_point => {
  const { time_delta, depth_delta } = data_point
  // Correct descent rate, this should be in bar/min
  return {
    ...data_point,
    descent_rate: (depth_delta / time_delta) * 60 || 0
  }
}

// TODO: Refactor this to be a pure function
let compartments_gas = getInitialCompartmentsGas()

const calculateCompartmentGasLoad = data_point => {
  const { exp } = Math

  const { descent_rate, time_delta, pressureN } = data_point

  const Pio = pressureN

  const R = descent_rate * pressureN
  const t = time_delta / 60 // In Minutes

  compartments_gas = compartments_gas.map(
    ({ gas_pressure: Po, ...rest }, index) => {
      const k = compartments[index].nitrogen.k
      return {
        ...rest,
        gas_pressure: Pio + R * (t - 1 / k) - (Pio - Po - R / k) * exp(-k * t)
      }
    }
  )

  return {
    ...data_point,
    compartments: compartments_gas
  }
}

const calculateCompartmentCeiling = data_point => {
  return {
    ...data_point,
    compartments: data_point.compartments.map((compartment, index) => {
      const { gas_pressure } = compartment
      const { nitrogen, helium } = compartments[index]
      const pressure_n2 = gas_pressure
      const pressure_he = 0

      const a_n2 = nitrogen.a
      const b_n2 = nitrogen.b
      const a_he = helium.a
      const b_he = helium.b

      const a_coefficient =
        (a_n2 * pressure_n2 + a_he * pressure_he) / (pressure_n2 + pressure_he)
      const b_coefficient =
        (b_n2 * pressure_n2 + b_he * pressure_he) / (pressure_n2 + pressure_he)

      const ceiling =
        (pressure_n2 + pressure_he - a_coefficient) * b_coefficient

      return {
        ...compartment,
        ceiling
      }
    })
  }
}

export const calculateDataPoint = pipeWithArgs(
  calculateAbmientPressure,
  calculatePartialPressureO2,
  calculatePartialPressureN2,
  calculateTimeDelta,
  calculateDepthDelta,
  calculateDescentRate,
  calculateCompartmentGasLoad,
  calculateCompartmentCeiling
)
