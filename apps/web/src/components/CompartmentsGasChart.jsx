import styled from '@emotion/styled'

import { ResponsiveBar } from '@nivo/bar'
import { always } from 'ramda'

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
`

const CeilingValuesLayer = ({ bars, yScale }) => {
  return (
    <>
      {bars.map(({ key, x, width, data }) => {
        const scaledCeiling = yScale(data.data.lowCeiling)

        return (
          <line
            key={key}
            x1={x}
            y1={scaledCeiling}
            x2={x + width}
            y2={scaledCeiling}
            style={{
              stroke: '#e09f3e',
              strokeWidth: 1
            }}
          />
        )
      })}
      {bars.map(({ key, x, width, data }) => {
        const scaledCeiling = yScale(data.data.highCeiling)

        return (
          <line
            key={key}
            x1={x}
            y1={scaledCeiling}
            x2={x + width}
            y2={scaledCeiling}
            style={{
              stroke: '#9e2a2b',
              strokeWidth: 1
            }}
          />
        )
      })}
      {bars.map(({ key, x, width, data }) => {
        const scaledCeiling = yScale(data.data.maxValue)

        return (
          <line
            key={key}
            x1={x}
            y1={scaledCeiling}
            x2={x + width}
            y2={scaledCeiling}
            style={{
              stroke: '#ff0df7',
              strokeWidth: 1
            }}
          />
        )
      })}
    </>
  )
}

export const CompartmentsGasChart = ({
  data: { compartments, ambientPressure },
  maxAmbientPressure
}) => (
  <Wrapper>
    <ResponsiveBar
      data={compartments}
      keys={['pressureLoadN2']}
      margin={{ top: 12, right: 12, bottom: 48, left: 62 }}
      padding={0.3}
      valueFormat='>-.2f'
      minValue={0}
      maxValue={maxAmbientPressure}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={{ scheme: 'blues' }}
      tooltip={always(null)}
      layers={[
        'grid',
        'axes',
        'bars',
        'markers',
        'legends',
        'annotations',
        CeilingValuesLayer
      ]}
      markers={[
        {
          axis: 'y',
          value: ambientPressure,
          lineStyle: { stroke: 'rgba(0, 0, 0, .35)', strokeWidth: 2 },
          legend: `Ambient Pressure (${ambientPressure.toFixed(2)} bar)`
        }
      ]}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Pressure Load (in bars)',
        legendPosition: 'middle',
        legendOffset: 32
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Compartment',
        legendPosition: 'middle',
        legendOffset: -40
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
    />
  </Wrapper>
)