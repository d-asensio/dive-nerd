import styled from 'styled-components'
import { ResponsiveLine } from '@nivo/line'

import { Tooltip } from './Tooltip'
import { DatapointInfoPanel } from './DatapointInfoPanel'
import { useCallback } from 'react'

const Wrapper = styled.div`
  min-width: 0;
  min-height: 0;
`

export const DiveProfileChart = ({ data, onDatapointHover }) => {
  const handleMouseMove = useCallback(
    ({ data }) => onDatapointHover(data),
    [onDatapointHover]
  )

  return (
    <Wrapper>
      <ResponsiveLine
        enablePoints={false}
        data={[
          {
            id: 'Dive Profile',
            data
          },
          {
            id: 'Low Ceiling',
            data: data.map(dataPoint => {
              const { time, lowCeiling } = dataPoint
              return {
                ...dataPoint,
                x: time / 60,
                y: lowCeiling
              }
            })
          },
          {
            id: 'High Ceiling',
            data: data.map(dataPoint => {
              const { time, highCeiling } = dataPoint
              return {
                ...dataPoint,
                x: time / 60,
                y: highCeiling
              }
            })
          },
          {
            id: 'Max Value',
            data: data.map(dataPoint => {
              const { time, maxValue } = dataPoint
              return {
                ...dataPoint,
                x: time / 60,
                y: maxValue
              }
            })
          }
        ]}
        colors={['#3daff7', '#e09f3e', '#9E2A2B', '#ff0df7']}
        margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
        xScale={{ type: 'linear' }}
        yScale={{
          type: 'linear',
          min: 'auto',
          max: 'auto',
          stacked: false,
          reverse: true
        }}
        yFormat=' >-.2f'
        animate={false}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Time (in minutes)',
          legendOffset: 36,
          legendPosition: 'middle'
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Depth (in meters)',
          legendOffset: -40,
          legendPosition: 'middle'
        }}
        pointSize={5}
        pointColor='white'
        pointBorderWidth={1}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh
        tooltip={({ point }) => (
          <Tooltip>
            <DatapointInfoPanel data={point.data} />
          </Tooltip>
        )}
        crosshairType='top'
        onMouseMove={handleMouseMove}
      />
    </Wrapper>
  )
}
