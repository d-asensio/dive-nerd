import {
  alveolarInertGasPartialPressure,
  alveolarWaterVaporPressure,
  buhlmannCompartments,
  CompartmentInertGasLoad,
  fromDepthToHydrostaticPressure,
  getSurfaceSaturatedCompartmentInertGasLoads,
  inertGasTimeConstant,
  inspiredGasChangeRate,
  schreinerEquation
} from "dive-physics";
import {DiveSegment} from "dive-planner";
import { pipe} from "ramda";

/**
 * Dive variables
 */
export const surfaceAmbientPressure = 1.0133 // bar
const waterDensity = 1023.6 // kg/m3
const GRAVITY = 9.80665  // m/s² — dive-physics declares this internally but doesn't export it
const waterVaporPressure = alveolarWaterVaporPressure({
  respiratoryQuotient: 0.9,
  carbonDioxidePressure: 0.0533,
  waterPressure: 0.0627
})
const interpolateIntervals = (intervals: DiveSegment[]) =>
  intervals.reduce((acc: DiveSegment[], interval) => {
    const sampleEvery = 0.5 // seconds to minutes
    const intervalTime = interval.finalTime - interval.initialTime
    const totalIntervals = Math.round(intervalTime / sampleEvery)

    const timeDelta = intervalTime / totalIntervals
    const depthDelta = (interval.finalDepth - interval.initialDepth) / totalIntervals

    return [
      ...acc,
      ...Array.from({length: totalIntervals}).map((_, i) => ({
        type: interval.type,
        initialTime: interval.initialTime + (timeDelta * i),
        finalTime: interval.initialTime + (timeDelta * (i + 1)),
        initialDepth: interval.initialDepth + (depthDelta * i),
        finalDepth: interval.initialDepth + (depthDelta * (i + 1)),
        gas: interval.gas
      }))
    ]
  }, []);

interface DiveProfileIntervalWithAmbientPressure extends DiveSegment {
  initialAmbientPressure: number
  finalAmbientPressure: number
}

interface DiveProfileIntervalWithDescentRate extends DiveProfileIntervalWithAmbientPressure {
  descentRate: number
}

interface DiveProfileIntervalWithAlveolarInertGasPressures extends DiveProfileIntervalWithDescentRate {
  startAlveolarInertGasPressures: {
    N2: number
    He: number
  }
}

const calculateAmbientPressure: (interval: DiveSegment) => DiveProfileIntervalWithAmbientPressure =
  interval => ({
    ...interval,
    initialAmbientPressure: fromDepthToHydrostaticPressure({
      depth: interval.initialDepth,
      surfaceAmbientPressure,
      waterDensity
    }),
    finalAmbientPressure: fromDepthToHydrostaticPressure({
      depth: interval.finalDepth,
      surfaceAmbientPressure,
      waterDensity
    }),
  })
const calculateDescentRate: (interval: DiveProfileIntervalWithAmbientPressure) => DiveProfileIntervalWithDescentRate =
  interval => ({
    ...interval,
    descentRate: (interval.finalAmbientPressure - interval.initialAmbientPressure) / (interval.finalTime - interval.initialTime)
  })
const calculateAlveolarInertGasPressures: (interval: DiveProfileIntervalWithDescentRate) => DiveProfileIntervalWithAlveolarInertGasPressures =
  interval => ({
    ...interval,
    startAlveolarInertGasPressures: {
      N2: alveolarInertGasPartialPressure({
        ambientPressure: interval.initialAmbientPressure,
        waterVaporPressure,
        inertGasFraction: 0.79
      }),
      He: alveolarInertGasPartialPressure({
        ambientPressure: interval.initialAmbientPressure,
        waterVaporPressure,
        inertGasFraction: 0
      })
    }
  })
const calculateInterval: (interval: DiveSegment) => DiveProfileIntervalWithAlveolarInertGasPressures =
  pipe(
    calculateAmbientPressure,
    calculateDescentRate,
    calculateAlveolarInertGasPressures
  )
const surfaceSaturatedCompartmentInertGasLoads = getSurfaceSaturatedCompartmentInertGasLoads({
  surfaceAmbientPressure,
  waterVaporPressure
})
export interface CalculateDiveProfileOptions {
  gfLow: number
  gfHigh: number
  firstStopAmbientPressure: number
}

export interface DiveProfileSample {
  x: number                                   // time in minutes
  y: number                                   // ambient pressure in bar (legacy nivo field name)
  depth: number                               // meters
  ambientPressure: number                     // bar
  compartmentInertGasLoads: CompartmentInertGasLoad[]
  ceilingDepth: number                        // meters, clamped to ≥ 0
}

const calculateCompartmentInertGasLoad = (
  intervals: DiveProfileIntervalWithAlveolarInertGasPressures[],
): Omit<DiveProfileSample, 'ceilingDepth'>[] =>
  intervals.reduce<Omit<DiveProfileSample, 'ceilingDepth'>[]>(
    (acc, interval) => {
      const lastSample = acc[acc.length - 1]
      const intervalTime = interval.finalTime - interval.initialTime

      const nextCompartmentInertGasLoads = lastSample.compartmentInertGasLoads.map(
        (compartmentInertGasLoads, compartmentId) => ({
          N2: schreinerEquation({
            initialAlveolarGasPartialPressure: interval.startAlveolarInertGasPressures.N2,
            initialCompartmentGasPartialPressure: compartmentInertGasLoads.N2,
            gasChangeRate: inspiredGasChangeRate({
              descentRate: interval.descentRate,
              inertGasFraction: 0.79,
            }),
            gasTimeConstant: inertGasTimeConstant({
              inertGasHalfTime: buhlmannCompartments[compartmentId].N2.halfTime,
            }),
            intervalTime,
          }),
          He: schreinerEquation({
            initialAlveolarGasPartialPressure: interval.startAlveolarInertGasPressures.He,
            initialCompartmentGasPartialPressure: compartmentInertGasLoads.He,
            gasChangeRate: inspiredGasChangeRate({
              descentRate: interval.descentRate,
              inertGasFraction: 0,
            }),
            gasTimeConstant: inertGasTimeConstant({
              inertGasHalfTime: buhlmannCompartments[compartmentId].He.halfTime,
            }),
            intervalTime,
          }),
        }),
      )

      return [
        ...acc,
        {
          compartmentInertGasLoads: nextCompartmentInertGasLoads,
          ambientPressure: interval.finalAmbientPressure,
          depth: interval.finalDepth,
          x: interval.finalTime,
          y: interval.finalAmbientPressure,
        },
      ]
    },
    [
      {
        compartmentInertGasLoads: surfaceSaturatedCompartmentInertGasLoads,
        ambientPressure: surfaceAmbientPressure,
        depth: 0,
        x: 0,
        y: surfaceAmbientPressure,
      },
    ],
  )

export const fromAmbientPressureToDepth = (ambientPressure: number): number =>
  ((ambientPressure - surfaceAmbientPressure) * 100000) / (waterDensity * GRAVITY)

export const calculateDiveProfile = (
  segments: DiveSegment[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- consumed in Task 3
  _options: CalculateDiveProfileOptions,
): DiveProfileSample[] => {
  const intervals = interpolateIntervals(segments)
  const enriched = intervals.map(calculateInterval)
  const samplesWithoutCeiling = calculateCompartmentInertGasLoad(enriched)

  // Ceiling pass arrives in Task 3 — placeholder of 0 keeps the type honest.
  return samplesWithoutCeiling.map(sample => ({ ...sample, ceilingDepth: 0 }))
}
