import { map, pipe } from 'ramda'
import compartments from './compartments'

/**
 * TODO: Validate this constant. Does this change at different ambient pressure (depth)?
 */
const WATER_VAPOUR_PARTIAL_PRESSURE = 0.0567

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

const calculateDescentRate = (data_point, index, samples) => {
  const previous_data_point = samples[index-1]

  if (!previous_data_point) {
    return {
      ...data_point,
      time_interval: 0,
      depth_delta: 0,
      descent_rate: 0
    }
  }

  const time_interval = data_point.time - previous_data_point.time
  const depth_delta = data_point.depth - previous_data_point.depth

  return {
    ...data_point,
    time_interval,
    depth_delta,
    descent_rate: depth_delta/time_interval*60
  }
}

const initializeCompartments = data_point => {
  const surface_pressure_in_bars = 1
  const air_nitrogen_partial_pressure = 0.79
  return {
    ...data_point,
    compartments: map(({ name }) => ({
      name,
      gas_pressure: air_nitrogen_partial_pressure*(surface_pressure_in_bars - WATER_VAPOUR_PARTIAL_PRESSURE)
    }), compartments)
  }
}

export const calculateDataPoint = pipe(
  calculateDescentRate,
  initializeCompartments,
  calculateAbmientPressure,
  calculatePartialPressureO2,
  calculatePartialPressureN2
)
