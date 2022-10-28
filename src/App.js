import { useCallback, useState, useRef } from 'react'
import styled from 'styled-components'
import { useDebouncedCallback } from 'use-debounce'

import Map from 'react-map-gl'
import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax

import * as ZHL16C from './buhlmann'

import {
  NavigationBar
} from './components'

import {
  CompartmentsViewer,
  Divelog,
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

const MapWrapper = styled.div`
  width: 100vw;
  height: 100vh;
`

function App () {
  const { samples, maxAmbientPressure } = useDive(dive)
  const [currentDatapoint, setData] = useState({
    compartments: ZHL16C.getInitialCompartmentsGas(),
    ambientPressure: 1
  })

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
  const handleDatapointHover = useDebouncedCallback(setData, 10)

  // const handleResetClick = useCallback(() => {
  //   mapRef.current?.flyTo({
  //     center: [-100, 40],
  //     zoom: 3.5,
  //     duration: 2000
  //   })
  // }, [])

  return (
    <Wrapper>
      <NavigationBar />
      <Layout>
        <Divelog gridArea='dive-log' />
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
      <MapWrapper>
        <Map
          {...viewState}
          mapLib={mapboxgl}
          ref={mapRef}
          mapStyle='mapbox://styles/mapbox/streets-v9'
          onMove={handleMapMove}
        />
      </MapWrapper>
    </Wrapper>
  )
}

export default App
