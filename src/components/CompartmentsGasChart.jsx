import styled from 'styled-components'
import { ResponsiveBullet } from '@nivo/bullet'

const Wrapper = styled.div`
  min-width: 0;
  min-height: 0;

  overflow-y: scroll;
`

export const CompartmentsGasChart = ({ data }) => (
  <Wrapper>
    <ResponsiveBullet
      axisPosition='before'
      rangeColors="seq:blues"
      data={data}
      minValue={0}
      height={3000}
      margin={{ top: 50, right: 90, bottom: 50, left: 90 }}
      spacing={46}
      titleAlign="start"
      titleOffsetX={-70}
      measureSize={0.2}
    />
  </Wrapper>
)
