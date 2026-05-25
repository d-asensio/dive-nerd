/**
 * Conversions between depth (m) and absolute ambient pressure (bar) for a
 * given environment.
 *
 * The forward direction (`depthToAmbientPressure`) is a thin wrapper around
 * the existing `fromDepthToHydrostaticPressure` in `dive-physics`. The
 * inverse direction (`ambientPressureToDepth`) is what the dive planner
 * needs to translate a ceiling computed in bars back into a stop depth in
 * meters.
 */
import { fromDepthToHydrostaticPressure } from 'dive-physics'

import { EnvironmentOptions } from './compartment-integrator'

const GRAVITY = 9.80665 // m/s²
const PASCALS_PER_BAR = 100000

export const createDepthPressureConverter = (environment: EnvironmentOptions) => {
  const depthToAmbientPressure = (depth: number): number =>
    fromDepthToHydrostaticPressure({
      depth,
      surfaceAmbientPressure: environment.surfaceAmbientPressure,
      waterDensity: environment.waterDensity
    })

  const ambientPressureToDepth = (ambientPressure: number): number => {
    const pressureAboveSurface = ambientPressure - environment.surfaceAmbientPressure
    return (pressureAboveSurface * PASCALS_PER_BAR) / (environment.waterDensity * GRAVITY)
  }

  return { depthToAmbientPressure, ambientPressureToDepth }
}

export type DepthPressureConverter = ReturnType<typeof createDepthPressureConverter>
