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
import EditIcon from '@mui/icons-material/Edit';

import * as ZHL16C from '@divenerd/dive-physics'

import { useSelector } from '../store'
import { NavigationBar, Layout } from '../components'
import { CompartmentsViewer, ProfileViewer } from '../sections'
import { diveSelector } from '../entities'
import Tooltip from '@mui/joy/Tooltip'


const Wrapper = styled.main`
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
`

function DiveViewerPage () {
  const { diveId } = useParams()

  const dive = useSelector((state) => diveSelector(state, diveId))

  const [currentDatapoint, setData] = useState({
    compartmentsGasLoad: ZHL16C.getInitialCompartmentsGas(),
    ambientPressure: 1
  })

  const handleDatapointHover = useDebouncedCallback(setData, 10)

  return (
    <Wrapper>
      <NavigationBar />
      <Layout>
        <Box
          sx={{
            borderLeft: 1,
            borderRight: 1,
            borderColor: 'divider',
            overflow: 'scroll',
            minHeight: 0
          }}
        >
          <Box
            sx={{
              p: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              borderBottom: 1,
              borderColor: 'divider'
            }}
          >
            <IconButton
              to='/'
              component={Link}
              size='lg'
              variant='outlined'
              color='neutral'
            >
              <ArrowBackIcon />
            </IconButton>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Typography level='h2'>{dive?.name}</Typography>
              <Tooltip title='Edit dive name' placement="right" size="sm">
                <IconButton
                  size='sm'
                  variant='plain'
                  color='neutral'
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            p: 3,
            borderRight: 1,
            borderColor: 'divider',
            overflow: 'scroll',
            minHeight: 0
          }}
        >
          <Tabs
            defaultValue={0}
            sx={{
              gap: 3
            }}
          >
            <TabList
              sx={{
                alignSelf: 'center'
              }}
            >
              <Tab>Dive Profile</Tab>
              <Tab>Media</Tab>
              <Tab>Gear</Tab>
            </TabList>
            <TabPanel value={0}>
              <ProfileViewer
                diveId={diveId}
                onDatapointHover={handleDatapointHover}
              />
              <CompartmentsViewer
                dataPoint={currentDatapoint}
                maxAmbientPressure={5}
              />
            </TabPanel>
            <TabPanel value={1}>Media</TabPanel>
            <TabPanel value={2}>Gear</TabPanel>
          </Tabs>
        </Box>
      </Layout>
    </Wrapper>
  )
}

export default DiveViewerPage
