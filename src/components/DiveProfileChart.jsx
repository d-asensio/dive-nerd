import { useCallback } from 'react'
import styled from 'styled-components'

import { ResponsiveLine } from '@nivo/line'
import Box from '@mui/joy/Box'
import Tooltip from '@mui/joy/Tooltip'

import { DatapointInfoPanel } from './DatapointInfoPanel'

const StatsTooltip = ({ point }) => {
  return (
    <Tooltip
      placement='top'
      variant='outlined'
      open
      arrow
      title={
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: 320,
            justifyContent: 'center',
            p: 1
          }}
        >
          <DatapointInfoPanel data={point.data} />
        </Box>
      }
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1px',
          height: '1px',
          margin: '-1px'
        }}
      />
    </Tooltip>
  )
}

const Wrapper = styled.div`
  min-width: 0;
  height: 500px;
`

export const DiveProfileChart = ({ data, onDatapointHover }) => {
  const handleMouseMove = useCallback(({ data }) => onDatapointHover(data), [
    onDatapointHover
  ])

  return (
    <Wrapper>
      <ResponsiveLine
        // enablePoints={false}
        data={[
          {
            id: 'Dive Profile',
            data
          },
          {
            id: 'Low Ceiling',
            data: data.map((dataPoint) => {
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
            data: data.map((dataPoint) => {
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
            data: data.map((dataPoint) => {
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
        tooltip={StatsTooltip}
        crosshairType='top'
        onMouseMove={handleMouseMove}
      />
    </Wrapper>
  )
}
