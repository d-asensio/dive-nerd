import {
  map,
  range,
  pipe,
  reduce,
  concat,
  last
} from "ramda";

interface DiveGeneratorOptions {
  samplingRate: number
  descentRate: number
  initialAmbientPressure: number
}

interface DivePlanSample {
  time: number
  ambientPressure: number
}

const lastEnsured =
  last as <T extends any>(list: readonly T[]) => T

export const createDiveProfileGenerator = (options: DiveGeneratorOptions) => {

  const {
    samplingRate,
    descentRate,
    initialAmbientPressure
  } = options

  function generateDivePlanForSegment (previousSample: DivePlanSample, endPressure: number): DivePlanSample[] {
    const {
      time: initialTime,
      ambientPressure: initialPressure
    } = previousSample

    const samplingRateSeconds = 60 / samplingRate
    const segmentPressureDelta = endPressure - initialPressure
    const segmentTimeDelta = segmentPressureDelta / descentRate * 60
    const segmentsCount = Math.ceil(segmentTimeDelta / samplingRateSeconds)

    const intervalDepthDelta = segmentPressureDelta / segmentsCount
    const intervalTimeDelta = segmentTimeDelta / segmentsCount

    return pipe(
      range(1),
      map(
        (segmentIndex) => ({
          time: segmentIndex*intervalTimeDelta + initialTime,
          ambientPressure: segmentIndex*intervalDepthDelta + initialPressure,
        })
      )
    )(segmentsCount + 1)
  }


  const generateFirstSample: () => DivePlanSample =
    () => ({
      time: 0,
      ambientPressure: initialAmbientPressure
    })

  const pressureLevelsToSegmentsReducer =
    (acc: DivePlanSample[], endAmbientPressure: number) => concat(
      acc,
      generateDivePlanForSegment(
        lastEnsured(acc),
        endAmbientPressure
      ))

  const generateFromAmbientPressureLevels: (ambientPressureLevels: number[]) => DivePlanSample[] =
    reduce(
      pressureLevelsToSegmentsReducer,
      [generateFirstSample()]
    )

  return {generateFromAmbientPressureLevels}
}