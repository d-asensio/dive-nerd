import { ResponsiveLine } from '@nivo/line'
import AspectRatio from '@mui/joy/AspectRatio'
import styled from 'styled-components'
import Tooltip from '@mui/joy/Tooltip'

const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
`

const DepthTooltip = ({ point }) => {
  return (
    <Tooltip
      placement='top'
      variant='solid'
      disableInteractive
      open
      arrow
      title={`${point.data.depth} m`}
    >
      <span />
    </Tooltip>
  )
}

export const DiveProfileThumbnail = ({ samples }) => {
  return (
    <AspectRatio>
      <ChartWrapper>
        <ResponsiveLine
          data={[
            {
              id: 'Dive Profile',
              data: samples
            }
          ]}
          colors={['#3daff7']}
          margin={{ top: 6, right: 6, bottom: 6, left: 6 }}
          xScale={{ type: 'linear' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
            reverse: true
          }}
          layers={['lines', 'mesh']}
          animate={false}
          enableGridX={false}
          enableGridY={false}
          useMesh
          tooltip={DepthTooltip}
        />
      </ChartWrapper>
    </AspectRatio>
  )
}
