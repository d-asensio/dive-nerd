import styled from 'styled-components'
import { map, pipe } from 'ramda'

import { DiveProfileChart } from './components'

import dive from './dives/Dive_2013-10-31-0957.json'

const Wrapper = styled.main`
  width: 100%;
  height: 100%;

  padding: 1em;
  overflow: hidden;
`

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

const { gas_mixtures } = dive

const calculatePartialPressureO2 = (data_point) => {
  const { pressure } = data_point

  return {
    ...data_point,
    pressureO2: pressure * gas_mixtures.oxygen,
  }
}

const calculatePartialPressureN2 = (data_point) => {
  const { pressure } = data_point

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

const calculateChartAxis = (data_point) => {
  const { time, depth } = data_point

  return {
    ...data_point,
    x: time,
    y: depth,
  }
}

const tranformDiveSamplesIntoChartData = map(
  pipe(
    calculateAbmientPressure,
    calculatePartialPressureO2,
    calculatePartialPressureN2,
    calculateChartAxis,
  ),
)

const data = tranformDiveSamplesIntoChartData(dive.samples)

function App() {
  return (
    <Wrapper>
      <DiveProfileChart data={data} />
    </Wrapper>
  )
}

export default App
