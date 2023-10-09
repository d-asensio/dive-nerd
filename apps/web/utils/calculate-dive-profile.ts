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
import {DiveProfileInterval} from "dive-profile-generator";
import {map, pipe} from "ramda";

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
const interpolateIntervals = (intervals: DiveProfileInterval[]) =>
  intervals.reduce((acc: DiveProfileInterval[], interval) => {
    const sampleEvery = 0.5 // seconds to minutes
    const intervalTime = interval.endTime - interval.startTime
    const totalIntervals = Math.round(intervalTime / sampleEvery)

    const timeDelta = intervalTime / totalIntervals
    const depthDelta = (interval.endDepth - interval.startDepth) / totalIntervals

    return [
      ...acc,
      ...Array.from({length: totalIntervals}).map((_, i) => ({
        type: interval.type,
        startTime: interval.startTime + (timeDelta * i),
        endTime: interval.startTime + (timeDelta * (i + 1)),
        startDepth: interval.startDepth + (depthDelta * i),
        endDepth: interval.startDepth + (depthDelta * (i + 1)),
        gasMix: interval.gasMix
      }))
    ]
  }, []);

interface DiveProfileIntervalWithAmbientPressure extends DiveProfileInterval {
  startAmbientPressure: number
  endAmbientPressure: number
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

const calculateAmbientPressure: (interval: DiveProfileInterval) => DiveProfileIntervalWithAmbientPressure =
  interval => ({
    ...interval,
    startAmbientPressure: fromDepthToHydrostaticPressure({
      depth: interval.startDepth,
      surfaceAmbientPressure,
      waterDensity
    }),
    endAmbientPressure: fromDepthToHydrostaticPressure({
      depth: interval.endDepth,
      surfaceAmbientPressure,
      waterDensity
    }),
  })
const calculateDescentRate: (interval: DiveProfileIntervalWithAmbientPressure) => DiveProfileIntervalWithDescentRate =
  interval => ({
    ...interval,
    descentRate: (interval.endAmbientPressure - interval.startAmbientPressure) / (interval.endTime - interval.startTime)
  })
const calculateAlveolarInertGasPressures: (interval: DiveProfileIntervalWithDescentRate) => DiveProfileIntervalWithAlveolarInertGasPressures =
  interval => ({
    ...interval,
    startAlveolarInertGasPressures: {
      N2: alveolarInertGasPartialPressure({
        ambientPressure: interval.startAmbientPressure,
        waterVaporPressure,
        inertGasFraction: 0.79
      }),
      He: alveolarInertGasPartialPressure({
        ambientPressure: interval.startAmbientPressure,
        waterVaporPressure,
        inertGasFraction: 0
      })
    }
  })
const calculateInterval: (interval: DiveProfileInterval) => DiveProfileIntervalWithAlveolarInertGasPressures =
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
  intervals.reduce(({cumulativeCompartmentInertGasLoad, intervals}, interval) => {
    const intervalTime = interval.endTime - interval.startTime

    const nextCumulativeCompartmentInertGasLoad = cumulativeCompartmentInertGasLoad.map((compartmentInertGasLoads, compartmentId) => ({
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

    return {
      cumulativeCompartmentInertGasLoad: nextCumulativeCompartmentInertGasLoad,
      intervals: [
        ...intervals,
        {
          compartmentInertGasLoads: nextCumulativeCompartmentInertGasLoad,
          ambientPressure: interval.endAmbientPressure,
          x: interval.endTime,
          y: interval.endAmbientPressure
        }
      ]
    }
  }, {
    cumulativeCompartmentInertGasLoad: surfaceSaturatedCompartmentInertGasLoads,
    intervals: [
      {
        compartmentInertGasLoads: surfaceSaturatedCompartmentInertGasLoads,
        ambientPressure: surfaceAmbientPressure,
        x: 0,
        y: surfaceAmbientPressure
      }
    ]
  })
export const calculateDiveProfile = pipe(
  interpolateIntervals,
  map(calculateInterval),
  calculateCompartmentInertGasLoad
)
