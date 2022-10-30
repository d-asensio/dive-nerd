import { useEffect, useState } from 'react'
import { map, sort } from 'ramda'
import * as ZHL16C from '@divenerd/dive-physics'

const calculateChartAxis = sample => {
  const { time, depth } = sample

  return {
    ...sample,
    x: time,
    y: depth
  }
}

export const useDive = dive => {
  const [samples, setSamples] = useState([])
  const [maxAmbientPressure, setmaxAmbientPressure] = useState([])

  useEffect(() => {
    const diveProfile = ZHL16C.calculateDiveProfile(dive?.samples ?? [])
    const samples = map(calculateChartAxis, diveProfile)

    const [maxDepthSample] = sort(
      ({ depth: da }, { depth: db }) => db - da,
      samples
    )

    setSamples(samples)
    setmaxAmbientPressure(maxDepthSample?.ambientPressure ?? 5)
  }, [dive])

  return { maxAmbientPressure, samples }
}
