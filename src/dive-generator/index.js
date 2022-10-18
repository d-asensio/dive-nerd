import { flatten, last, map, pipe, range, reduce } from 'ramda'

const specsExample = {
  samplingIntervals: 20,
  initialDepth: 0,
  segments: [
    {
      duration: 5 * 60,
      endDepth: 50
    },
    {
      duration: 2 * 60,
      endDepth: 50
    },
    {
      duration: 3 * 60,
      endDepth: 40
    },
    {
      duration: 5 * 60,
      endDepth: 30
    },
    {
      duration: 15 * 60,
      endDepth: 30
    },
    {
      duration: 5 * 60,
      endDepth: 20
    },
    {
      duration: 15 * 60,
      endDepth: 20
    },
    {
      duration: 9 * 60,
      endDepth: 10
    },
    {
      duration: 4 * 60,
      endDepth: 5
    },
    {
      duration: 3 * 60,
      endDepth: 3
    },
    {
      duration: 40,
      endDepth: 0
    }
  ]
}

export const createDiveGenerator = ({
  initialDepth,
  samplingIntervals,
  segments
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
      map(sampleIndex => ({
        time: startTime + sampleIndex * samplingIntervals,
        depth: _roundWithPrecision(startDepth + depthDelta * sampleIndex, 2),
        temperature: 21,
        gas_mixtures: {
          oxygen: 0.21,
          nitrogen: 0.79,
          helium: 0
        }
      }))
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
