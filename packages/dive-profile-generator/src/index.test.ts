import { map, range } from 'ramda'

interface DiveSegment {
  from: number
  to: number
}

interface DiveGeneratorOptions {
  samplingRateSeconds: number
  descentRate: number
}

interface DivePlanSample {
  time: number
  depth: number
}

const createDiveProfileGenerator = (options: DiveGeneratorOptions) => {

  const { samplingRateSeconds, descentRate} = options

  function generateFromSegments (segments: DiveSegment[]): DivePlanSample[] {
    const [{ from, to }] = segments

    const segmentDepthDelta = to - from
    const segmentTimeDelta = segmentDepthDelta/descentRate*60
    const segmentsCount = segmentTimeDelta/samplingRateSeconds

    const intervalDepthDelta = segmentDepthDelta/segmentsCount
    const intervalTimeDelta = segmentTimeDelta/segmentsCount

    return map(
      (segmentIndex) => ({
        time: segmentIndex * intervalTimeDelta,
        depth: segmentIndex * intervalDepthDelta,
      }),
      range(0, segmentsCount + 1),
    )
  }

  return { generateFromSegments }
}

describe('createDiveProfileGenerator.generateFromSegments', () => {
  it('generates a dive profile with two data points from a single segment', () => {
    const diveProfileGenerator = createDiveProfileGenerator({
      samplingRateSeconds: 60,
      descentRate: 10
    })

    const result = diveProfileGenerator.generateFromSegments([
      { from: 0, to: 10 }
    ])

    expect(result).toStrictEqual([
      { time: 0,  depth: 0  },
      { time: 60, depth: 10 }
    ])
  })

  it('generates a dive profile with three data points from a single segment', () => {
    const diveProfileGenerator = createDiveProfileGenerator({
      samplingRateSeconds: 60,
      descentRate: 10
    })

    const result = diveProfileGenerator.generateFromSegments([
      { from: 0, to: 20 }
    ])

    expect(result).toStrictEqual([
      { time: 0,   depth: 0  },
      { time: 60,  depth: 10 },
      { time: 120, depth: 20 }
    ])
  })
})