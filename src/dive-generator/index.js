import { flatten, last, map, pipe, range, reduce } from 'ramda'
const { Noise } = require('noisejs')

const noise = new Noise(Math.random())

const specsExample = {
  samplingIntervals: 50,
  initialDepth: 0,
  segments: [
    {
      duration: 2 * 60 + 42,
      endDepth: 48
    },
    {
      duration: 2 * 60 + 18,
      endDepth: 48
    },
    {
      duration: 3 * 60 + 40,
      endDepth: 15
    },
    {
      duration: 1 * 60 + 30,
      endDepth: 6
    },
    {
      duration: 1 * 60,
      endDepth: 3
    },
    {
      duration: 3 * 60,
      endDepth: 3
    },
    {
      duration: 1 * 60,
      endDepth: 0
    }
  ]
}

function perlin(x, y, distortion) {
  const value = noise.simplex2(x / 100, y / 100)

  return value * distortion
}

export const createDiveGenerator = ({
  initialDepth,
  samplingIntervals,
  segments,
  withPerlinDeviation = false
}) => {
  const _roundWithPrecision = (number, precision) =>
    Math.round(number * 10 * precision) / 10 / precision

  const _reduceSegmentToSamples = (acc, { duration, endDepth }) => {
    const lastSample = last(acc)
    const startTime = acc.length * samplingIntervals
    const samplesToGenerate = duration / samplingIntervals
    const startDepth = lastSample?.depth ?? initialDepth
    const depthDelta = (endDepth - startDepth) / samplesToGenerate

    const _generateSamples = pipe(
      range(0),
      map(sampleIndex => {
        const time = startTime + sampleIndex * samplingIntervals
        const depth = _roundWithPrecision(
          startDepth + depthDelta * sampleIndex,
          2
        )

        const perlinDepth = perlin(time, depth, 0.9)

        return {
          time,
          depth: withPerlinDeviation ? depth + perlinDepth : depth,
          temperature: 21,
          gasMixtures: {
            O2: 0.21,
            N2: 0.79,
            He: 0
          }
        }
      })
    )

    return flatten([acc, _generateSamples(samplesToGenerate + 1)])
  }

  const _generateSamplesfromSegments = reduce(_reduceSegmentToSamples, [])

  function generate() {
    return {
      samples: _generateSamplesfromSegments(segments)
    }
  }

  return {
    generate
  }
}

export default createDiveGenerator(specsExample).generate()
