import { DivePlan, DiveProfile, DiveSegment } from './types'

import { createBuhlmannZHL16Algorithm } from './buhlmannZHL16-decompression-algorithm'
import { createCompartmentIntegrator, EnvironmentOptions } from './compartment-integrator'
import defaultLevelsToSegmentsInterpolator from './levels-to-segments-interpolator'

interface DecompressionAlgorithm {
  calculateDiveProfileFromSegments: (segments: DiveSegment[]) => DiveProfile
}

interface DivePlannerDependencies {
  buildDecompressionAlgorithm?: (plan: DivePlan) => DecompressionAlgorithm
  levelsToSegmentsInterpolator?: typeof defaultLevelsToSegmentsInterpolator
}

interface DivePlanner {
  /** @deprecated use `calculateDiveProfileFromPlan`. */
  calculateDiveProfileFromPlanV1: (plan: DivePlan) => DiveSegment[]
  calculateDiveProfileFromPlan: (plan: DivePlan) => DiveProfile
}

const DEFAULT_ENVIRONMENT: EnvironmentOptions = {
  surfaceAmbientPressure: 1.0133,
  waterDensity: 1023.6,
  waterVaporPressure: 0.0567
}

const environmentOf = (plan: DivePlan): EnvironmentOptions | undefined =>
  plan.surfaceAmbientPressure !== undefined &&
  plan.waterDensity !== undefined &&
  plan.waterVaporPressure !== undefined
    ? {
        surfaceAmbientPressure: plan.surfaceAmbientPressure,
        waterDensity: plan.waterDensity,
        waterVaporPressure: plan.waterVaporPressure
      }
    : undefined

const gradientFactorsOf = (plan: DivePlan) =>
  plan.gradientFactorLow !== undefined && plan.gradientFactorHigh !== undefined
    ? { gfLow: plan.gradientFactorLow, gfHigh: plan.gradientFactorHigh }
    : undefined

const buildAlgorithm = (plan: DivePlan) =>
  createBuhlmannZHL16Algorithm({}, {
    ascentRate: plan.ascentRate,
    gradientFactors: gradientFactorsOf(plan),
    environment: environmentOf(plan),
    availableGases: plan.availableGases,
    switchAtMod: plan.switchAtMod,
    lastStopDepth: plan.lastStopDepth,
    circuit: plan.circuit,
    setpointHigh: plan.setpointHigh
  })

const defaultBuildDecompressionAlgorithm = (plan: DivePlan): DecompressionAlgorithm =>
  buildAlgorithm(plan)

export const createDivePlanner = (dependencies: DivePlannerDependencies = {}): DivePlanner => {
  const {
    buildDecompressionAlgorithm = defaultBuildDecompressionAlgorithm,
    levelsToSegmentsInterpolator = defaultLevelsToSegmentsInterpolator
  } = dependencies

  const calculateUserSegments = (plan: DivePlan): DiveSegment[] =>
    levelsToSegmentsInterpolator.interpolate(plan.levels, {
      descentRate: plan.descentRate,
      ascentRate: plan.ascentRate,
      circuit: plan.circuit,
      diluent: plan.diluent,
      setpointLow: plan.setpointLow,
      setpointHigh: plan.setpointHigh
    })

  // The bailout schedule: assume the unit fails at the end of bottom time, then
  // decompress open-circuit from that point on the diluent (breathed OC) as the
  // back gas plus the available deco gases.
  const calculateBailout = (plan: DivePlan, userSegments: DiveSegment[]): DiveProfile | undefined => {
    if (plan.circuit !== 'CCR') return undefined
    if (userSegments.length === 0) return undefined

    const environment = environmentOf(plan) ?? DEFAULT_ENVIRONMENT
    const integrator = createCompartmentIntegrator(environment)
    const loads = userSegments.reduce(
      (acc, segment) =>
        integrator.advance({
          compartmentLoads: acc,
          segment: {
            initialDepth: segment.initialDepth,
            finalDepth: segment.finalDepth,
            duration: segment.finalTime - segment.initialTime,
            gas: segment.gas,
            circuit: segment.circuit,
            setpoint: segment.setpoint
          }
        }),
      integrator.initialCompartmentLoads()
    )

    const lastSegment = userSegments[userSegments.length - 1]
    // OC algorithm: switchAtMod follows the plan, but circuit is forced OC.
    const ocAlgorithm = createBuhlmannZHL16Algorithm({}, {
      ascentRate: plan.ascentRate,
      gradientFactors: gradientFactorsOf(plan),
      environment: environmentOf(plan),
      availableGases: plan.availableGases,
      switchAtMod: plan.switchAtMod,
      lastStopDepth: plan.lastStopDepth,
      circuit: 'OC'
    })

    return ocAlgorithm.decompressFromState({
      loads,
      depth: lastSegment.finalDepth,
      time: lastSegment.finalTime,
      backGas: plan.diluent ?? lastSegment.gas,
      decoGases: (plan.availableGases ?? []).filter(gas => gas.isDecoGas)
    })
  }

  const calculateDiveProfileFromPlan = (plan: DivePlan): DiveProfile => {
    const segments = calculateUserSegments(plan)
    const primary = buildDecompressionAlgorithm(plan).calculateDiveProfileFromSegments(segments)
    const bailout = calculateBailout(plan, segments)
    return bailout ? { ...primary, bailout } : primary
  }

  return {
    calculateDiveProfileFromPlanV1: calculateUserSegments,
    calculateDiveProfileFromPlan
  }
}

export default createDivePlanner()
