import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import styled from '@emotion/styled'
import { useDebouncedCallback } from 'use-debounce'

import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import IconButton from '@mui/joy/IconButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import Tabs from '@mui/joy/Tabs'
import TabList from '@mui/joy/TabList'
import Tab from '@mui/joy/Tab'
import TabPanel from '@mui/joy/TabPanel'
import EditIcon from '@mui/icons-material/Edit'

import * as ZHL16C from '@divenerd/dive-physics'

import { useSelector } from '../store'
import { NavigationBar, Layout } from '../components'
import { CompartmentsViewer, DiveMap, ProfileViewer } from '../sections'
import { diveSelector } from '../entities'
import Tooltip from '@mui/joy/Tooltip'
import { DiveInfo } from '../components/DiveInfo'
import { AspectRatio } from '@mui/joy'

const Wrapper = styled.main`
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
`

function AsideHeader ({ diveId }) {
  const dive = useSelector((state) => diveSelector(state, diveId))

  return (
    <Box
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        borderBottom: 1,
        borderColor: 'divider'
      }}
    >
      <IconButton
        to="/"
        component={Link}
        size="md"
        variant="outlined"
        color="neutral"
      >
        <ArrowBackIcon/>
      </IconButton>
      <Box
        sx={{
          gap: 0.5,
          display: 'flex',
          alignItems: 'center',
          minWidth: 0
        }}
      >
        <Typography
          noWrap
          level="h3"
        >
          {dive?.name}
        </Typography>
        <Tooltip title="Edit dive name" placement="right" size="sm">
          <IconButton
            size="sm"
            variant="plain"
            color="neutral"
          >
            <EditIcon/>
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}

function Content ({ diveId }) {
  const [currentDatapoint, setData] = useState({
    compartmentsGasLoad: ZHL16C.getInitialCompartmentsGas(),
    ambientPressure: 1
  })

  const handleDatapointHover = useDebouncedCallback(setData, 10)

  return (
    <Box
      sx={{
        height: '100%',
        minHeight: 0,
        display: 'grid',
        gridTemplateRows: '3fr 1fr'
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
  )
}

function DiveViewerPage () {
  const { diveId } = useParams()

  return (
    <Wrapper>
      <NavigationBar/>
      <Layout>
        <Box
          sx={{
            borderLeft: 1,
            borderRight: 1,
            borderColor: 'divider',
            display: 'grid',
            gridTemplateRows: 'min-content auto 300px',
            minHeight: 0,
            minWidth: 0
          }}
        >
          <AsideHeader diveId={diveId}/>
          <Box
            sx={{
              minHeight: 0,
              overflowY: 'scroll'
            }}
          >
            <DiveInfo/>
          </Box>
          <DiveMap/>
        </Box>
        <Box
          sx={{
            p: 3,
            borderRight: 1,
            borderColor: 'divider',
            overflowY: 'scroll',
            minHeight: 0
          }}
        >
          <Content
            diveId={diveId}
          />
        </Box>
      </Layout>
    </Wrapper>
  )
}

export default DiveViewerPage
