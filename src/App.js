import styled from 'styled-components'

import { DiveProfileChart } from './components'

import dive from './dives/Dive_2013-10-31-0957.json'

const Wrapper = styled.main`
  width: 400vw;
  height: 100vh;
`

const fromDepthToPressure = depth => {
  const surface_pressure_in_bars = 1
  // const fresh_water_density = 997.0474 
  const salt_water_density = 1023.6 // kg/m^3 (in salty water) TODO: account for temperature?
  const gravity = 9.8 // m*s^2
  const pressure_in_pascals = depth*salt_water_density*gravity
  const pressure_in_bars = pressure_in_pascals/100000

  return pressure_in_bars + surface_pressure_in_bars
}

const ppN2 = (ambient_pressure, nitrogen_percentage) => {
  const surface_pressure_in_bars = 1
  const water_vapour_partial_pressure = 0.0567 // TODO: Validate this constant, should it change with depth?

  return ambient_pressure * nitrogen_percentage * (surface_pressure_in_bars - water_vapour_partial_pressure)
}

const tranformDiveIntoChartData = ({ samples, gas_mixtures }) => [{
  id: 'Dive Profile',
  data: samples.map(
    sample => {
      const { depth, time } = sample
      const pressure = fromDepthToPressure(depth)
      const pressureO2 = pressure * gas_mixtures.oxygen
      const pressureN = ppN2(pressure, gas_mixtures.nitrogen)

      return {
        depth,
        time,
        pressure,
        pressureO2,
        pressureN,
        x: time,
        y: depth
      }
    }
  )
}]

const data = tranformDiveIntoChartData(dive)

function App() {
  return (
    <Wrapper>
      <DiveProfileChart data={data} />
    </Wrapper>
  );
}

export default App;
