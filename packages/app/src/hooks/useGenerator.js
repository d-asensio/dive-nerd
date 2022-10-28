import { useEffect, useState } from 'react'
import { generateDive } from '@divenerd/dive-generator'

import { useDive } from './useDive'

export const useGenerator = ({ samplingIntervals, withPerlinNoise, segments }) => {
  const [dive, setDive] = useState({ samples: [] })

  useEffect(() => {
    const generatedDive = generateDive({ samplingIntervals, withPerlinNoise, segments })
    setDive(generatedDive)
  }, [samplingIntervals, withPerlinNoise, segments])

  return useDive(dive)
}
