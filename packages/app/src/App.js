import { useState } from 'react'
import styled from 'styled-components'
import { useDebouncedCallback } from 'use-debounce'

import { mockDives } from '@divenerd/mock-dives'
import * as ZHL16C from '@divenerd/dive-physics'

import {
  NavigationBar,
  Layout
} from './components'

import {
  CompartmentsViewer,
  DiveLog,
  DiveMap,
  ProfileViewer
} from './sections'

import { useDive } from './hooks/useDive'

const Wrapper = styled.main`
  width: 100%;
  height: 100%;
`

function App () {
  const { samples, maxAmbientPressure } = useDive(mockDives.diveY2022M04D12T0704)
  const [currentDatapoint, setData] = useState({
    compartments: ZHL16C.getInitialCompartmentsGas(),
    ambientPressure: 1
  })

  const handleDatapointHover = useDebouncedCallback(setData, 10)

  return (
    <Wrapper>
      <NavigationBar />
      <Layout
        template={`
          "dive-log profile-viewer "
          "dive-log compartments-viewer"
        `}
      >
        <Layout.Area name='dive-log'>
          <DiveLog samples={samples} />
        </Layout.Area>
        <Layout.Area name='profile-viewer'>
          <ProfileViewer
            samples={samples}
            onDatapointHover={handleDatapointHover}
          />
        </Layout.Area>
        <Layout.Area name='compartments-viewer'>
          <CompartmentsViewer
            dataPoint={currentDatapoint}
            maxAmbientPressure={maxAmbientPressure}
          />
        </Layout.Area>
      </Layout>
      <DiveMap />
    </Wrapper>
  )
}

export default App
