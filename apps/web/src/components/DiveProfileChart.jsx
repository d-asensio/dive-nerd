import { useCallback } from 'react'
import styled from '@emotion/styled'

import { ResponsiveLine } from '@nivo/line'
import CircularProgress from '@mui/joy/CircularProgress'
import Tooltip from '@mui/joy/Tooltip'

import { DatapointInfoPanel } from './DatapointInfoPanel'
import { identity } from 'ramda'

const StatsTooltip = ({ point }) => {
  return (
    <Tooltip
      placement='top'
      variant='outlined'
      disableInteractive
      open
      arrow
      title={
        <DatapointInfoPanel data={point.data} />
      }
    >
      <span />
    </Tooltip>
  )
}

const Wrapper = styled.div`
  min-width: 0;
  height: 500px;
`

export const DiveProfileChart = ({ samples, onDatapointHover = identity }) => {
  const handleMouseMove = useCallback(
    ({ data }) => onDatapointHover(data),
    [onDatapointHover]
  )

  if (!samples) return <CircularProgress />

  return (
    <Wrapper>
      <ResponsiveLine
        // enablePoints={false}
        data={[
          {
            id: 'Dive Profile',
            data: samples
          },
          {
            id: 'Low Ceiling',
            data: samples.map((dataPoint) => {
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
            data: samples.map((dataPoint) => {
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
            data: samples.map((dataPoint) => {
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
        margin={{ top: 12, right: 12, bottom: 48, left: 62 }}
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
        tooltip={StatsTooltip}
        crosshairType='bottom'
        onMouseMove={handleMouseMove}
      />
    </Wrapper>
  )
}
