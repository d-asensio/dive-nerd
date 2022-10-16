import { ResponsiveLine } from '@nivo/line'

const tooltipFn = ({ point: { data: { time, depth, pressure, pressureO2, pressureN } } }) => (
    <ul>
      <li>Time: <strong>{time} seconds</strong></li>
      <li>Depth: <strong>{depth} meters</strong></li>
      <li>Pressure: <strong>{pressure.toFixed(2)} bar</strong></li>
      <li>P.P. Oxygen: <strong>{pressureO2.toFixed(2)} bar</strong></li>
      <li>P.P. Nitrogen: <strong>{pressureN.toFixed(2)} bar</strong></li>
    </ul>
  )

export const DiveProfileChart = ({ data }) => (
  <ResponsiveLine
    data={data}
    colors={["#3daff7"]}
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    xScale={{ type: 'linear' }}
    yScale={{
      type: 'linear',
      min: 'auto',
      max: 'auto',
      stacked: true,
      reverse: true,
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
      legendPosition: 'middle',
    }}
    axisLeft={{
      orient: 'left',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'Depth',
      legendOffset: -40,
      legendPosition: 'middle',
    }}
    pointSize={10}
    pointColor="white"
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
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
  />
)
