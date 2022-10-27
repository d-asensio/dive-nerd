import { useEffect, useState } from 'react'
import { useDive } from './useDive'
import { generateDive } from '../dive-generator'

export const useGenerator = ({ samplingIntervals, withPerlinNoise, segments }) => {
  const [dive, setDive] = useState({ samples: [] })

  useEffect(() => {
    const generatedDive = generateDive({ samplingIntervals, withPerlinNoise, segments })
    setDive(generatedDive)
  }, [samplingIntervals, withPerlinNoise, segments])

  return useDive(dive)
}
