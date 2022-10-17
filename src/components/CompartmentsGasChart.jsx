import styled from 'styled-components'
import { ResponsiveBar } from '@nivo/bar'
import { always } from 'ramda'

const Wrapper = styled.div`
  min-width: 0;
  min-height: 0;

  overflow-y: scroll;
`

const MaxValuesLayer = ({ bars }) => {
  return (
    <>
      {bars.map(({ key, x, y, width, height }) => (
        <line
          key={key}
          x1={x + width}
          y1={y}
          x2={x + width}
          y2={y + height}
          style={{
            stroke: 'rgb(255, 0, 0)',
            strokeWidth: 2,
          }}
        />
      ))}
    </>
  )
}

export const CompartmentsGasChart = ({
  data,
  ambientPressure,
  maxAmbientPressure,
}) => (
  <Wrapper>
    <ResponsiveBar
      data={data}
      keys={['gas_pressure']}
      margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
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
        MaxValuesLayer,
      ]}
      markers={[
        {
          axis: 'x',
          value: ambientPressure,
          lineStyle: { stroke: 'rgba(0, 0, 0, .35)', strokeWidth: 2 },
          legend: `Ambient Pressure (${ambientPressure.toFixed(2)} bar)`,
          legendOrientation: 'vertical',
        },
      ]}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Tissue Pressure Load (in bars)',
        legendPosition: 'middle',
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Compartment',
        legendPosition: 'middle',
        legendOffset: -40,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
    />
  </Wrapper>
)
