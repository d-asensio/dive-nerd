import styled from 'styled-components'
import { addIndex, map, pipe, sort } from 'ramda'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import * as ZHL16C from './buhlmann'
import { DiveProfileChart } from './components'
import { CompartmentsGasChart } from './components/CompartmentsGasChart'
import { DatapointInfoPanel } from './components/DatapointInfoPanel'

// import dive from './dives/Dive_2013-10-31-0957.json'
// import dive from './dives/Dive_2015-02-28-1040.json' // 50m
// import dive from './dives/Dive_2015-05-31-0911.json'

// My dives
// import dive from './dives/Dive_2022-08-28-0946.json'
// import dive from './dives/Dive_2022-04-12-0704.json'

// Generator
import dive from './dive-generator'

const Wrapper = styled.main`
  width: 100%;
  height: 100%;

  overflow: hidden;

  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 1em;
`

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
`

const Frame = styled.div`
  padding: 1.5em 2em;
  margin-bottom: 1em;
`

const calculateChartAxis = sample => {
  const { time, depth } = sample

  return {
    ...sample,
    x: time / 60, // In minutes
    y: depth
  }
}

console.time('Time to calculate profile:')
const diveProfile = ZHL16C.calculateDiveProfile(dive.samples)
console.log(diveProfile)
console.timeEnd('Time to calculate profile:')

const diveData = map(calculateChartAxis, diveProfile)

const [maxDepthSample] = sort(
  ({ depth: da }, { depth: db }) => db - da,
  diveData
)

function App() {
  const [currentDatapoint, setData] = useState({
    compartments: ZHL16C.getInitialCompartmentsGas(),
    ambientPressure: 1,
    time: 0,
    depth: 0,
    alveolarPressureN2: 0.79,
    ambientPressureDelta: 0,
    timeDelta: 0,
    depthDelta: 0,
    descentRate: 0
  })

  const handleDatapointHover = useDebouncedCallback(setData, 10)

  return (
    <Wrapper>
      <DiveProfileChart
        data={diveData}
        onDatapointHover={handleDatapointHover}
      />
      <Sidebar>
        <Frame>
          <DatapointInfoPanel data={currentDatapoint} />
        </Frame>
        <CompartmentsGasChart
          data={currentDatapoint}
          maxAmbientPressure={maxDepthSample.ambientPressure}
        />
      </Sidebar>
    </Wrapper>
  )
}

export default App
