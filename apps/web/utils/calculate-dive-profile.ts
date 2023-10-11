import {
  alveolarInertGasPartialPressure,
  alveolarWaterVaporPressure,
  buhlmannCompartments,
  fromDepthToHydrostaticPressure,
  getSurfaceSaturatedCompartmentInertGasLoads,
  inertGasTimeConstant,
  inspiredGasChangeRate,
  schreinerEquation
} from "dive-physics";
import {DiveSegment} from "dive-planner";
import { map, pipe} from "ramda";

/**
 * Dive variables
 */
export const surfaceAmbientPressure = 1.0133 // bar
const waterDensity = 1023.6 // kg/m3
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
const calculateCompartmentInertGasLoad = (intervals: DiveProfileIntervalWithAlveolarInertGasPressures[]) =>
  intervals.reduce((intervals, interval) => {
    const lastInterval = intervals[intervals.length - 1]
    const intervalTime = interval.finalTime - interval.initialTime

    const nextCumulativeCompartmentInertGasLoad = lastInterval.compartmentInertGasLoads.map((compartmentInertGasLoads, compartmentId) => ({
      N2: schreinerEquation({
        initialAlveolarGasPartialPressure: interval.startAlveolarInertGasPressures.N2,
        initialCompartmentGasPartialPressure: compartmentInertGasLoads.N2,
        gasChangeRate: inspiredGasChangeRate({
          descentRate: interval.descentRate,
          inertGasFraction: 0.79
        }),
        gasTimeConstant: inertGasTimeConstant({
          inertGasHalfTime: buhlmannCompartments[compartmentId].N2.halfTime
        }),
        intervalTime
      }),
      He: schreinerEquation({
        initialAlveolarGasPartialPressure: interval.startAlveolarInertGasPressures.He,
        initialCompartmentGasPartialPressure: compartmentInertGasLoads.He,
        gasChangeRate: inspiredGasChangeRate({
          descentRate: interval.descentRate,
          inertGasFraction: 0
        }),
        gasTimeConstant: inertGasTimeConstant({
          inertGasHalfTime: buhlmannCompartments[compartmentId].He.halfTime
        }),
        intervalTime
      }),
    }))

    return [
        ...intervals,
        {
          compartmentInertGasLoads: nextCumulativeCompartmentInertGasLoad,
          ambientPressure: interval.finalAmbientPressure,
          x: interval.finalTime,
          y: interval.finalAmbientPressure
        }
      ]
  }, [
    {
      compartmentInertGasLoads: surfaceSaturatedCompartmentInertGasLoads,
      ambientPressure: surfaceAmbientPressure,
      x: 0,
      y: surfaceAmbientPressure
    }
  ])
export const calculateDiveProfile = pipe(
  interpolateIntervals,
  map(calculateInterval),
  calculateCompartmentInertGasLoad
)
