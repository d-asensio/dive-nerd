import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import styled from '@emotion/styled'
import { useDebouncedCallback } from 'use-debounce'

import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import IconButton from '@mui/joy/IconButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import * as ZHL16C from '@divenerd/dive-physics'

import { useSelector } from '../store'
import { NavigationBar, Layout } from '../components'
import { CompartmentsViewer, ProfileViewer } from '../sections'

const Wrapper = styled.main`
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
`

function DiveViewerPage() {
  let { diveId } = useParams();

  const name = useSelector(({ name }) => name)

  const [currentDatapoint, setData] = useState({
    compartmentsGasLoad: ZHL16C.getInitialCompartmentsGas(),
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3
            }}
          >
            <IconButton
              to="/"
              component={Link}
              size="lg"
              variant="outlined"
              color="neutral"
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography level="h2">{name}</Typography>
          </Box>
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
            diveId={diveId}
            onDatapointHover={handleDatapointHover}
          />
          <CompartmentsViewer
            dataPoint={currentDatapoint}
            maxAmbientPressure={5}
          />
        </Box>
      </Layout>
    </Wrapper>
  )
}

export default DiveViewerPage
