/**
 * Advances the 16-compartment inert-gas loads through a single dive segment
 * using the Schreiner equation.
 *
 * A segment is defined by an initial depth, a final depth, a duration and
 * the breathing gas. The integrator assumes the descent/ascent rate is
 * constant within the segment (which matches how `DiveSegment`s are built).
 *
 * Everything in this module is in (bar, meter, minute). All pure math lives
 * in `dive-physics`; this module just wires it together for the segment
 * abstraction and is the **one place** that knows how to advance a
 * compartment collection.
 */
import {
  alveolarInertGasPartialPressure,
  buhlmannCompartments,
  fromDepthToHydrostaticPressure,
  inertGasTimeConstant,
  inspiredGasChangeRate,
  schreinerEquation
} from 'dive-physics'

import { Gas } from './types'

export interface CompartmentInertLoad {
  nitrogenPartialPressure: number
  heliumPartialPressure: number
}

export interface EnvironmentOptions {
  surfaceAmbientPressure: number // bar
  waterDensity: number // kg/m³
  waterVaporPressure: number // bar
}

interface SegmentToIntegrate {
  initialDepth: number // m
  finalDepth: number // m
  duration: number // min
  gas: Gas
}

const inertGasFractionOf = ({ fO2, fHe }: Gas) => ({
  nitrogen: 1 - fO2 - fHe,
  helium: fHe
})

const ambientPressureAt = (depth: number, environment: EnvironmentOptions): number =>
  fromDepthToHydrostaticPressure({
    depth,
    surfaceAmbientPressure: environment.surfaceAmbientPressure,
    waterDensity: environment.waterDensity
  })

const ambientPressureChangeRate = ({
  initialDepth,
  finalDepth,
  duration,
  environment
}: {
  initialDepth: number
  finalDepth: number
  duration: number
  environment: EnvironmentOptions
}): number => {
  if (duration === 0) return 0

  const initialAmbientPressure = ambientPressureAt(initialDepth, environment)
  const finalAmbientPressure = ambientPressureAt(finalDepth, environment)

  return (finalAmbientPressure - initialAmbientPressure) / duration
}

export const createCompartmentIntegrator = (environment: EnvironmentOptions) => {
  const initialCompartmentLoads = (): CompartmentInertLoad[] =>
    buhlmannCompartments.map(() => ({
      nitrogenPartialPressure:
        (environment.surfaceAmbientPressure - environment.waterVaporPressure) * 0.79,
      heliumPartialPressure: 0
    }))

  const advance = ({
    compartmentLoads,
    segment
  }: {
    compartmentLoads: CompartmentInertLoad[]
    segment: SegmentToIntegrate
  }): CompartmentInertLoad[] => {
    const { initialDepth, finalDepth, duration, gas } = segment
    const inertFraction = inertGasFractionOf(gas)
    const initialAmbientPressure = ambientPressureAt(initialDepth, environment)

    const initialAlveolarNitrogen = alveolarInertGasPartialPressure({
      ambientPressure: initialAmbientPressure,
      waterVaporPressure: environment.waterVaporPressure,
      inertGasFraction: inertFraction.nitrogen
    })
    const initialAlveolarHelium = alveolarInertGasPartialPressure({
      ambientPressure: initialAmbientPressure,
      waterVaporPressure: environment.waterVaporPressure,
      inertGasFraction: inertFraction.helium
    })

    const pressureChangeRate = ambientPressureChangeRate({
      initialDepth,
      finalDepth,
      duration,
      environment
    })
    const nitrogenChangeRate = inspiredGasChangeRate({
      descentRate: pressureChangeRate,
      inertGasFraction: inertFraction.nitrogen
    })
    const heliumChangeRate = inspiredGasChangeRate({
      descentRate: pressureChangeRate,
      inertGasFraction: inertFraction.helium
    })

    return compartmentLoads.map((load, index) => ({
      nitrogenPartialPressure: schreinerEquation({
        initialAlveolarGasPartialPressure: initialAlveolarNitrogen,
        initialCompartmentGasPartialPressure: load.nitrogenPartialPressure,
        gasChangeRate: nitrogenChangeRate,
        gasTimeConstant: inertGasTimeConstant({
          inertGasHalfTime: buhlmannCompartments[index].N2.halfTime
        }),
        intervalTime: duration
      }),
      heliumPartialPressure: schreinerEquation({
        initialAlveolarGasPartialPressure: initialAlveolarHelium,
        initialCompartmentGasPartialPressure: load.heliumPartialPressure,
        gasChangeRate: heliumChangeRate,
        gasTimeConstant: inertGasTimeConstant({
          inertGasHalfTime: buhlmannCompartments[index].He.halfTime
        }),
        intervalTime: duration
      })
    }))
  }

  return { initialCompartmentLoads, advance }
}

export type CompartmentIntegrator = ReturnType<typeof createCompartmentIntegrator>
