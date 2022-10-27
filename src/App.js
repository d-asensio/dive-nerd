import { useCallback, useState, useRef, memo } from 'react'
import styled from 'styled-components'
import { useDebouncedCallback } from 'use-debounce'

import Map from 'react-map-gl'
import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax

import Card from '@mui/joy/Card'

import * as ZHL16C from './buhlmann'
import {
  DiveProfileChart,
  CompartmentsGasChart,
  DiveList,
  DiveLogPanel
} from './components'

import dive from './dives/Dive_2022-04-12-0704.json'
import { useDive } from './hooks/useDive'

const Wrapper = styled.main`
  width: 100%;
  height: 100%;
`

const StyledCard = styled(Card)`
  overflow: hidden;
`

const InfoLayout = styled.div`
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-columns: 3fr 1fr;
`

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
`

const Charts = memo(() => {
  const { samples, maxAmbientPressure } = useDive(dive)

  const [currentDatapoint, setData] = useState({
    compartments: ZHL16C.getInitialCompartmentsGas(),
    ambientPressure: 1
  })

  const handleDatapointHover = useDebouncedCallback(setData, 10)

  return (
    <StyledCard>
      <InfoLayout>
        <DiveProfileChart
          samples={samples}
          onDatapointHover={handleDatapointHover}
        />
        <Sidebar>
          <CompartmentsGasChart
            data={currentDatapoint}
            maxAmbientPressure={maxAmbientPressure}
          />
        </Sidebar>
      </InfoLayout>
    </StyledCard>
  )
})

const Layout = styled.div`
  position: absolute;
  left: 50%;
  width: 100%;
  height: 100vh;
  max-width: 1800px;
  z-index: 1;
  transform: translateX(-50%);

  display: grid;
  grid-template-columns: 3fr 5fr;
  align-items: start;
  gap: 2em;
  padding: 2em;

  pointer-events: none;

  > * {
    pointer-events: initial;
  }
`

function App () {
  const mapRef = useRef(null)
  const [viewState, setViewState] = useState({
    longitude: -100,
    latitude: 40,
    zoom: 3.5
  })

  const handleMapMove = useCallback(
    ({ viewState }) => setViewState(viewState),
    []
  )

  // const handleResetClick = useCallback(() => {
  //   mapRef.current?.flyTo({
  //     center: [-100, 40],
  //     zoom: 3.5,
  //     duration: 2000
  //   })
  // }, [])

  return (
    <Wrapper>
      <Layout>
        <DiveLogPanel>
          <DiveList>
            <DiveList.Item
              name='Thomas Reef'
              date='25/10/2022 10:30 AM'
              depth='48.2 m'
              time='00:38'
            />
            <DiveList.Divider />
            <DiveList.Item
              name='Thomas Reef'
              date='25/10/2022 10:30 AM'
              depth='48.2 m'
              time='00:38'
            />
          </DiveList>
        </DiveLogPanel>
        <Charts />
      </Layout>
      <Map
        {...viewState}
        mapLib={mapboxgl}
        ref={mapRef}
        mapStyle='mapbox://styles/mapbox/streets-v9'
        onMove={handleMapMove}
      />
    </Wrapper>
  )
}

export default App
