import styled from 'styled-components'
import { addIndex, map, pipe, sort } from 'ramda'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import * as ZHL16C from './buhlmann'
import { DiveProfileChart } from './components'

import dive from './dives/Dive_2013-10-31-0957.json'
import { CompartmentsGasChart } from './components/CompartmentsGasChart'

const Wrapper = styled.main`
  width: 100%;
  height: 100%;

  overflow: hidden;

  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 1em;
`

const calculateChartAxis = data_point => {
  const { time, depth } = data_point

  return {
    ...data_point,
    x: time,
    y: depth
  }
}

const mapIndexed = addIndex(map)

const tranformDiveSamplesIntoChartData = mapIndexed(
  pipe(ZHL16C.calculateDataPoint, calculateChartAxis)
)

const diveData = tranformDiveSamplesIntoChartData(dive.samples)

const [maxDepthSample] = sort(
  ({ depth: da }, { depth: db }) => db - da,
  diveData
)

function App() {
  const [compartmentsData, setCompartmentsData] = useState([])
  const [ambientPressure, setAmbientPressure] = useState(1)

  const handleDatapointHover = useDebouncedCallback(
    ({ compartments, pressure }) => {
      const newCompartmentsData = compartments.map(
        ({ name, gas_pressure }) => ({
          id: name,
          gas_pressure
        })
      )

      setCompartmentsData(newCompartmentsData)
      setAmbientPressure(pressure)
    },
    50
  )

  return (
    <Wrapper>
      <DiveProfileChart
        data={diveData}
        onDatapointHover={handleDatapointHover}
      />
      <CompartmentsGasChart
        data={compartmentsData}
        ambientPressure={ambientPressure}
        maxAmbientPressure={maxDepthSample.pressure * 2}
      />
    </Wrapper>
  )
}

export default App
