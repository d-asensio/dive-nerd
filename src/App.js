import styled from 'styled-components'
import { ResponsiveLine } from '@nivo/line'
import dive from './dives/Dive_2013-10-31-0957.json'

const Wrapper = styled.main`
  width: 400vw;
  height: 100vh;
`

const tooltipFn = ({ point: { data: { time, depth, pressure, pressureO2, pressureN } } }) => (
  <ul>
    <li>Time: <strong>{time} seconds</strong></li>
    <li>Depth: <strong>{depth} meters</strong></li>
    <li>Pressure: <strong>{pressure.toFixed(2)} bar</strong></li>
    <li>P.P. Oxygen: <strong>{pressureO2.toFixed(2)} bar</strong></li>
    <li>P.P. Nitrogen: <strong>{pressureN.toFixed(2)} bar</strong></li>
  </ul>
)

const DiveProfileChart = ({ data }) => (
  <ResponsiveLine
    data={data}
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    xScale={{ type: 'point' }}
    yScale={{
      type: 'linear',
      min: 'auto',
      max: 'auto',
      stacked: true,
      reverse: true
    }}
    yFormat=" >-.2f"
    axisTop={null}
    axisRight={null}
    axisBottom={{
      orient: 'bottom',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'Time',
      legendOffset: 36,
      legendPosition: 'middle'
    }}
    axisLeft={{
      orient: 'left',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'Depth',
      legendOffset: -40,
      legendPosition: 'middle'
    }}
    pointSize={10}
    pointColor={{ theme: 'background' }}
    pointBorderWidth={2}
    pointBorderColor={{ from: 'serieColor' }}
    pointLabelYOffset={-12}
    useMesh={true}
    tooltip={tooltipFn}
    legends={[
      {
        anchor: 'bottom-right',
        direction: 'column',
        justify: false,
        translateX: 100,
        translateY: 0,
        itemsSpacing: 0,
        itemDirection: 'left-to-right',
        itemWidth: 80,
        itemHeight: 20,
        itemOpacity: 0.75,
        symbolSize: 12,
        symbolShape: 'circle',
        symbolBorderColor: 'rgba(0, 0, 0, .5)',
        effects: [
          {
            on: 'hover',
            style: {
              itemBackground: 'rgba(0, 0, 0, .03)',
              itemOpacity: 1
            }
          }
        ]
      }
    ]}
  />
)

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
  color: 'hsl(137, 70%, 50%)',
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
