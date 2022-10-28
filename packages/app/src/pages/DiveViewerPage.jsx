import { useState } from 'react'
import styled from '@emotion/styled'
import { useDebouncedCallback } from 'use-debounce'

import Box from '@mui/joy/Box'

import { mockDives } from '@divenerd/mock-dives'
import * as ZHL16C from '@divenerd/dive-physics'

import { NavigationBar, Layout } from '../components'

import { CompartmentsViewer, DiveLog, ProfileViewer } from '../sections'

import { useDive } from '../hooks/useDive'

const Wrapper = styled.main`
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
`

function DiveViewerPage () {
  const { samples, maxAmbientPressure } = useDive(
    mockDives.diveY2022M04D12T0704,
  )
  const [currentDatapoint, setData] = useState({
    compartments: ZHL16C.getInitialCompartmentsGas(),
    ambientPressure: 1,
  })

  const handleDatapointHover = useDebouncedCallback(setData, 10)

  return (
    <Wrapper>
      <NavigationBar />
      <Layout>
        <Box
          sx={{
            p: 3,
            borderLeft: 1,
            borderRight: 1,
            borderColor: 'divider',
            overflow: 'scroll',
            minHeight: 0,
          }}
        >
          <DiveLog samples={samples} />
        </Box>
        <Box
          sx={{
            p: 3,
            borderRight: 1,
            borderColor: 'divider',
            overflow: 'scroll',
            minHeight: 0,
          }}
        >
          <ProfileViewer
            samples={samples}
            onDatapointHover={handleDatapointHover}
          />
          <CompartmentsViewer
            dataPoint={currentDatapoint}
            maxAmbientPressure={maxAmbientPressure}
          />
        </Box>
      </Layout>
    </Wrapper>
  )
}

export default DiveViewerPage
