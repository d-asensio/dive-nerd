import styled from 'styled-components'
import { ResponsiveBar } from '@nivo/bar'
import { always } from 'ramda'

const Wrapper = styled.div`
  position: relative;
  width: 100%;

  overflow-y: scroll;

  flex: 1;

  > div {
    position: absolute;
    width: 100%;
    height: 100%;
    min-height: 400px;
  }
`

const CeilingValuesLayer = ({ bars, xScale }) => {
  return (
    <>
      {bars.map(({ key, y, height, data }) => {
        const scaledCeiling = xScale(data.data.lowCeiling)

        return (
          <line
            key={key}
            x1={scaledCeiling}
            y1={y}
            x2={scaledCeiling}
            y2={y + height}
            style={{
              stroke: '#e09f3e',
              strokeWidth: 1
            }}
          />
        )
      })}
      {bars.map(({ key, y, height, data }) => {
        const scaledCeiling = xScale(data.data.highCeiling)

        return (
          <line
            key={key}
            x1={scaledCeiling}
            y1={y}
            x2={scaledCeiling}
            y2={y + height}
            style={{
              stroke: '#9e2a2b',
              strokeWidth: 1
            }}
          />
        )
      })}
      {bars.map(({ key, y, height, data }) => {
        const scaledCeiling = xScale(data.data.maxValue)

        return (
          <line
            key={key}
            x1={scaledCeiling}
            y1={y}
            x2={scaledCeiling}
            y2={y + height}
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
    <div>
      <ResponsiveBar
        data={compartments}
        keys={['pressureLoadN2']}
        margin={{ top: 0, right: 60, bottom: 50, left: 60 }}
        padding={0.3}
        layout="horizontal"
        valueFormat=">-.2f"
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
            axis: 'x',
            value: ambientPressure,
            lineStyle: { stroke: 'rgba(0, 0, 0, .35)', strokeWidth: 2 },
            legend: `Ambient Pressure (${ambientPressure.toFixed(2)} bar)`,
            legendOrientation: 'vertical'
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
    </div>
  </Wrapper>
)
