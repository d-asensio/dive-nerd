import { ResponsiveLine } from '@nivo/line'
import { Tooltip } from './Tooltip'
import { DatapointInfoPanel } from './DatapointInfoPanel'

export const DiveProfileChart = ({ data }) => (
  <ResponsiveLine
    data={[
      {
        id: 'Dive Profile',
        data,
      },
    ]}
    colors={['#3daff7']}
    margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
    xScale={{ type: 'linear' }}
    yScale={{
      type: 'linear',
      min: 'auto',
      max: 'auto',
      stacked: true,
      reverse: true,
    }}
    yFormat=" >-.2f"
    animate={false}
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
    tooltip={({ point }) => (
      <Tooltip>
        <DatapointInfoPanel data={point.data} />
      </Tooltip>
    )}
    crosshairType="top"
  />
)
