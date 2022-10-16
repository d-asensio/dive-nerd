import styled from 'styled-components'
import { addIndex, map, pipe } from 'ramda'

import * as ZHL16C from './buhlmann'
import { DiveProfileChart } from './components'

import dive from './dives/Dive_2013-10-31-0957.json'

const Wrapper = styled.main`
  width: 100%;
  height: 100%;

  padding: 1em;
  overflow: hidden;
`

const calculateChartAxis = data_point => {
  const { time, depth } = data_point

  return {
    ...data_point,
    x: time,
    y: depth
  }
}

const mapIndexed = addIndex(map)

const tranformDiveSamplesIntoChartData = mapIndexed(
  pipe(ZHL16C.calculateDataPoint, calculateChartAxis)
)

const data = tranformDiveSamplesIntoChartData(dive.samples)

function App() {
  return (
    <Wrapper>
      <DiveProfileChart data={data} />
    </Wrapper>
  )
}

export default App
