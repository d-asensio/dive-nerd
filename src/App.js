import styled from 'styled-components'
import { map, sort } from 'ramda'
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
// import dive from './dive-generator' TODO: Fix that

const dive = {
  samples: [
    {
      time: 0,
      depth: 0,
      temperature: 21,
      gasMixtures: {
        O2: 0.21,
        N2: 0.79,
        He: 0
      }
    },
    {
      time: 2 * 60,
      depth: 35,
      temperature: 21,
      gasMixtures: {
        O2: 0.21,
        N2: 0.79,
        He: 0
      }
    },
    {
      time: 12 * 60,
      depth: 35,
      temperature: 21,
      gasMixtures: {
        O2: 0.21,
        N2: 0.79,
        He: 0
      }
    },
    {
      time: 14 * 60 + 13,
      depth: 15,
      temperature: 21,
      gasMixtures: {
        O2: 0.21,
        N2: 0.79,
        He: 0
      }
    },
    {
      time: 15 * 60 + 43,
      depth: 6,
      temperature: 21,
      gasMixtures: {
        O2: 0.21,
        N2: 0.79,
        He: 0
      }
    },
    {
      time: 16 * 60 + 45,
      depth: 6,
      temperature: 21,
      gasMixtures: {
        O2: 0.21,
        N2: 0.79,
        He: 0
      }
    },
    {
      time: 17 * 60 + 45,
      depth: 3,
      temperature: 21,
      gasMixtures: {
        O2: 0.21,
        N2: 0.79,
        He: 0
      }
    },
    {
      time: 21 * 60 + 40,
      depth: 3,
      temperature: 21,
      gasMixtures: {
        O2: 0.21,
        N2: 0.79,
        He: 0
      }
    },
    {
      time: 22 * 60 + 40,
      depth: 0,
      temperature: 21,
      gasMixtures: {
        O2: 0.21,
        N2: 0.79,
        He: 0
      }
    }
  ]
}

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
    ambientPressure: 1
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
