import styled from 'styled-components'
import { ResponsiveBar } from '@nivo/bar'

const Wrapper = styled.div`
  min-width: 0;
  min-height: 0;

  overflow-y: scroll;
`

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
      tooltip={false}
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
        legend: 'Tissue Pressure Load (in bar)',
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
