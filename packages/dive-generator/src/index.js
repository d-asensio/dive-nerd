const { Noise } = require('noisejs')

const noise = new Noise(Math.random())

function perlin (x, y, distortion) {
  const value = noise.simplex2(x / 100, y / 100)

  return value * distortion
}

const generateDive = ({
  withPerlinNoise,
  samplingIntervals,
  segments
}) => {
  const samples = []
  let previousSegment = null

  for (const currentSegmentIndex in segments) {
    const currentSegment = segments[currentSegmentIndex]

    if (!previousSegment) {
      previousSegment = currentSegment
      samples.push({
        time: currentSegment.time,
        depth: currentSegment.depth,
        temperature: 21,
        gasMixture: {
          O2: 0.21,
          N2: 0.79,
          He: 0
        }
      })
      continue
    }

    for (
      let i = 1;
      previousSegment.time + i * samplingIntervals <= currentSegment.time;
      i++
    ) {
      const segmentDepthDelta = currentSegment.depth - previousSegment.depth
      const segmentTimeDelta = currentSegment.time - previousSegment.time
      const segmentIntervalCount = segmentTimeDelta / samplingIntervals

      const depthIncrement = segmentDepthDelta / segmentIntervalCount

      const isLastSegment = currentSegmentIndex >= segments.length - 1
      const isLastSample = isLastSegment && i >= segmentIntervalCount

      const time = previousSegment.time + i * samplingIntervals
      const depth = previousSegment.depth + i * depthIncrement

      const perlinDepth =
        withPerlinNoise && !isLastSample ? perlin(time, depth, 0.9) : 0

      samples.push({
        time,
        depth: depth + perlinDepth,
        temperature: 21,
        gasMixture: {
          O2: 0.21,
          N2: 0.79,
          He: 0
        }
      })
    }

    previousSegment = currentSegment
  }

  return { samples }
}

module.exports = { generateDive }
