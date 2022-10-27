import { useCallback, useState, useRef, memo } from 'react'
import styled from 'styled-components'
import { map, sort } from 'ramda'
import { useDebouncedCallback } from 'use-debounce'

import Map from 'react-map-gl'
import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax

import Card from '@mui/joy/Card'

import * as ZHL16C from './buhlmann'
import {
  DiveProfileChart,
  CompartmentsGasChart,
  DatapointInfoPanel
} from './components'

// import dive from './dives/Dive_2013-10-31-0957.json'
// import dive from './dives/Dive_2015-02-28-1040.json' // 50m
// import dive from './dives/Dive_2015-05-31-0911.json'

// My dives
// import dive from './dives/Dive_2022-08-28-0946.json'
// import dive from './dives/Dive_2022-04-12-0704.json'

// Generator
import { generateDive } from './dive-generator'

const dive = generateDive({
  samplingIntervals: 20,
  withPerlinNoise: false,
  segments: [
    {
      time: 0,
      depth: 0
    },
    {
      time: 2 * 60,
      depth: 35
    },
    {
      time: 12 * 60,
      depth: 35
    },
    {
      time: 14 * 60 + 13,
      depth: 15
    },
    {
      time: 15 * 60 + 43,
      depth: 6
    },
    {
      time: 16 * 60 + 45,
      depth: 6
    },
    {
      time: 17 * 60 + 45,
      depth: 3
    },
    {
      time: 21 * 60 + 40,
      depth: 3
    },
    {
      time: 22 * 60 + 40,
      depth: 0
    }
  ]
})

const Wrapper = styled.main`
  width: 100%;
  height: 100%;
`

const ChartWrapper = styled.div`
  position: absolute;
  bottom: 2em;
  left: 2em;
  right: 2em;
  top: 2em;
`

const StyledCard = styled(Card)`
  width: 100%;
  height: 100%;

  overflow: hidden;
`

const InfoLayout = styled.div`
  width: 100%;
  height: 100%;

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

const Charts = memo(() => {
  const [currentDatapoint, setData] = useState({
    compartments: ZHL16C.getInitialCompartmentsGas(),
    ambientPressure: 1
  })

  const handleDatapointHover = useDebouncedCallback(setData, 10)

  return (
    <ChartWrapper>
      <StyledCard>
        <InfoLayout>
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
        </InfoLayout>
      </StyledCard>
    </ChartWrapper>
  )
})

const Button = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
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

  const handleResetClick = useCallback(() => {
    mapRef.current?.flyTo({
      center: [-100, 40],
      zoom: 3.5,
      duration: 2000
    })
  }, [])

  return (
    <Wrapper>
      <Map
        {...viewState}
        mapLib={mapboxgl}
        ref={mapRef}
        mapStyle='mapbox://styles/mapbox/streets-v9'
        onMove={handleMapMove}
      />
      <Charts />
      <Button onClick={handleResetClick}>Reset</Button>
    </Wrapper>
  )
}

export default App
