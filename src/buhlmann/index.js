import { map, pipe } from 'ramda'

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
      pressure: pressure_in_bars + surface_pressure_in_bars,
    }
  }
  
  const calculatePartialPressureO2 = (data_point) => {
    const { pressure, gas_mixtures } = data_point
  
    return {
      ...data_point,
      pressureO2: pressure * gas_mixtures.oxygen,
    }
  }
  
  const calculatePartialPressureN2 = (data_point) => {
    const { pressure, gas_mixtures } = data_point
  
    const surface_pressure_in_bars = 1
    const water_vapour_partial_pressure = 0.0567 // TODO: Validate this constant, should it change with depth?
  
    return {
      ...data_point,
      pressureN:
        pressure *
        gas_mixtures.nitrogen *
        (surface_pressure_in_bars - water_vapour_partial_pressure),
    }
  }

  export const calculateDataPoint = pipe(
    calculateAbmientPressure,
    calculatePartialPressureO2,
    calculatePartialPressureN2,
  )