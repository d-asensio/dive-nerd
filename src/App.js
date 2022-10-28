import { useState } from 'react'
import styled from 'styled-components'
import { useDebouncedCallback } from 'use-debounce'

import * as ZHL16C from './buhlmann'

import {
  NavigationBar
} from './components'

import {
  CompartmentsViewer,
  DiveLog,
  DiveMap,
  ProfileViewer
} from './sections'

import dive from './dives/Dive_2022-04-12-0704.json'
import { useDive } from './hooks/useDive'

const Wrapper = styled.main`
  width: 100%;
  height: 100%;
`

const Layout = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;

  max-width: 1800px;
  
  left: 50%;
  transform: translateX(-50%);

  display: grid;
  grid-template-areas:
    "dive-log profile-viewer "
    "dive-log compartments-viewer";
  grid-template-columns: 3fr 5fr;
  grid-template-rows: min-content min-content;
  align-items: start;
  gap: 2em;
  padding: 2em;

  pointer-events: none;

  > * {
    pointer-events: initial;
  }
`

function App () {
  const { samples, maxAmbientPressure } = useDive(dive)
  const [currentDatapoint, setData] = useState({
    compartments: ZHL16C.getInitialCompartmentsGas(),
    ambientPressure: 1
  })

  const handleDatapointHover = useDebouncedCallback(setData, 10)

  return (
    <Wrapper>
      <NavigationBar />
      <Layout>
        <DiveLog gridArea='dive-log' />
        <ProfileViewer
          gridArea='profile-viewer'
          samples={samples}
          onDatapointHover={handleDatapointHover}
        />
        <CompartmentsViewer
          gridArea='compartments-viewer'
          dataPoint={currentDatapoint}
          maxAmbientPressure={maxAmbientPressure}
        />
      </Layout>
      <DiveMap />
    </Wrapper>
  )
}

export default App
