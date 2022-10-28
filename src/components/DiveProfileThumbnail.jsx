import { ResponsiveLine } from '@nivo/line'
import AspectRatio from '@mui/joy/AspectRatio'
import styled from 'styled-components'

const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
`

export const DiveProfileThumbnail = ({ samples }) => {
  return (
    <AspectRatio>
      <ChartWrapper>
        <ResponsiveLine
          enablePoints={false}
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
          layers={['lines']}
          animate={false}
          enableGridX={false}
          enableGridY={false}
          isInteractive={false}
        />
      </ChartWrapper>
    </AspectRatio>
  )
}
