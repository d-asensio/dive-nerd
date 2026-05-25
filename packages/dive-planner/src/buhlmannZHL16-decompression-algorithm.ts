/**
 * Bühlmann ZH-L16C decompression algorithm with Gradient Factors.
 *
 * See `spec/buhlmann-16-zhl.md` §8. This module is the **orchestrator** —
 * every physical quantity it needs is delegated to a collaborator obtained
 * through the factory (`compartmentIntegrator`, `depthPressureConverter`,
 * `decoGasSelector`, `ceilingCalculator`). Nothing here computes inert
 * pressures or M-values directly.
 *
 * Input: the dive segments produced by `levels-to-segments-interpolator` for
 *        the **user's bottom plan only** — no fake deco appended.
 * Output: a full `DiveProfile` with the user segments followed by
 *         alternating `ASCENT` / `DECO_STOP` segments down to the surface.
 */
import { buhlmannCompartments, divingCeilingAmbientPressure, gradientFactorAt } from 'dive-physics'

import {
  CompartmentInertLoad,
  CompartmentIntegrator,
  createCompartmentIntegrator,
  EnvironmentOptions
} from './compartment-integrator'
import {
  createDepthPressureConverter,
  DepthPressureConverter
} from './depth-pressure-conversion'
import { roundUpToStopGrid, nextShallowerStop } from './stop-depth'
import { mergeConsecutiveAscents } from './merge-consecutive-ascents'
import {
  BestDecoGasSelector,
  createBestDecoGasSelector
} from './best-deco-gas-selector'
import {
  GasSwitchDepthCalculator,
  createGasSwitchDepthCalculator
} from './gas-switch-depths'
import {
  DiveProfile,
  DiveProfileIntervalType,
  DiveSegment,
  Gas
} from './types'

const DEFAULT_ENVIRONMENT: EnvironmentOptions = {
  surfaceAmbientPressure: 1.0133,
  waterDensity: 1023.6,
  waterVaporPressure: 0.0567
}

const DEFAULT_GRADIENT_FACTORS = { gfLow: 1, gfHigh: 1 }

const DEFAULT_STOP_TIME_STEP_MINUTES = 0.1
const STOP_DURATION_ROUNDING_MINUTES = 1

const compartmentCoefficients = buhlmannCompartments.map(c => ({
  nitrogen: { a: c.N2.a, b: c.N2.b },
  helium: { a: c.He.a, b: c.He.b }
}))

interface AlgorithmDependencies {
  compartmentIntegrator?: CompartmentIntegrator
  depthPressureConverter?: DepthPressureConverter
  decoGasSelector?: BestDecoGasSelector
  gasSwitchDepthCalculator?: GasSwitchDepthCalculator
}

interface AlgorithmOptions {
  environment?: EnvironmentOptions
  gradientFactors?: { gfLow: number; gfHigh: number }
  ascentRate?: number             // m/min (positive number)
  stopTimeStepMinutes?: number    // integration step used while at a stop
  availableGases?: Gas[]          // candidates for deco gas switches
  /**
   * When `true` (default), inserts a procedural gas-switch stop at each
   * deco gas's MOD even if Bühlmann would not require a stop there. When
   * `false`, gas switches happen at the first natural deco stop.
   */
  switchAtMod?: boolean
  /**
   * Depth of the last decompression stop (m, on the 3 m grid). Default 3.
   * Set to 6 to skip the 3 m stop — the algorithm will instead hold at
   * 6 m until the surface ceiling clears.
   */
  lastStopDepth?: number
}

interface AlgorithmInput {
  segments: DiveSegment[]
}

interface AlgorithmRun {
  loads: CompartmentInertLoad[]
  intervals: DiveSegment[]
  runTime: number
}

const ceilUpToWholeMinutes = (minutes: number, step: number): number => {
  if (minutes <= 0) return 0
  return Math.ceil(minutes / step) * step
}

export const createBuhlmannZHL16Algorithm = (
  dependencies: AlgorithmDependencies = {},
  options: AlgorithmOptions = {}
) => {
  const environment = options.environment ?? DEFAULT_ENVIRONMENT
  const gradientFactors = options.gradientFactors ?? DEFAULT_GRADIENT_FACTORS
  const ascentRate = options.ascentRate ?? 9
  const stopTimeStep = options.stopTimeStepMinutes ?? DEFAULT_STOP_TIME_STEP_MINUTES
  const availableGases = options.availableGases ?? []
  const switchAtMod = options.switchAtMod ?? true
  const lastStopDepth = options.lastStopDepth ?? 3

  const compartmentIntegrator =
    dependencies.compartmentIntegrator ?? createCompartmentIntegrator(environment)
  const depthPressureConverter =
    dependencies.depthPressureConverter ?? createDepthPressureConverter(environment)
  const decoGasSelector = dependencies.decoGasSelector ?? createBestDecoGasSelector()
  const gasSwitchDepthCalculator =
    dependencies.gasSwitchDepthCalculator ??
    createGasSwitchDepthCalculator({ depthPressureConverter })

  const deepestGasSwitchDepth = (): number => {
    const switchDepths = gasSwitchDepthCalculator.switchDepthsOf(availableGases)
    if (switchDepths.length === 0) return 0
    return Math.max(...switchDepths)
  }

  const integrateUserSegments = (segments: DiveSegment[]): AlgorithmRun =>
    segments.reduce<AlgorithmRun>(
      (run, segment) => ({
        loads: compartmentIntegrator.advance({
          compartmentLoads: run.loads,
          segment: {
            initialDepth: segment.initialDepth,
            finalDepth: segment.finalDepth,
            duration: segment.finalTime - segment.initialTime,
            gas: segment.gas
          }
        }),
        intervals: [...run.intervals, segment],
        runTime: segment.finalTime
      }),
      {
        loads: compartmentIntegrator.initialCompartmentLoads(),
        intervals: [],
        runTime: 0
      }
    )

  const ceilingDepthAt = (loads: CompartmentInertLoad[], gradientFactor: number): number => {
    const ceilingAmbient = divingCeilingAmbientPressure({
      compartmentLoads: loads,
      compartmentCoefficients,
      gradientFactor
    })
    return depthPressureConverter.ambientPressureToDepth(ceilingAmbient)
  }

  const firstStopDepth = (loads: CompartmentInertLoad[]): number => {
    const rawCeilingDepth = ceilingDepthAt(loads, gradientFactors.gfLow)
    return roundUpToStopGrid(rawCeilingDepth)
  }

  /**
   * The GF schedule is anchored at the **dive's first stop** (fixed for the
   * whole deco phase) and interpolates linearly up to the surface. It must
   * not be re-anchored at each stop — that would reset the schedule and
   * make deep stops over-conservative.
   */
  const effectiveGradientFactorAt = ({
    depth,
    diveFirstStop
  }: {
    depth: number
    diveFirstStop: number
  }): number =>
    gradientFactorAt({
      bounds: gradientFactors,
      firstStopAmbientPressure: depthPressureConverter.depthToAmbientPressure(diveFirstStop),
      surfaceAmbientPressure: environment.surfaceAmbientPressure,
      ambientPressure: depthPressureConverter.depthToAmbientPressure(depth)
    })

  const previousGasOf = (run: AlgorithmRun): Gas | undefined =>
    run.intervals[run.intervals.length - 1]?.gas

  const isSwitchFromPrevious = (run: AlgorithmRun, gas: Gas): boolean => {
    const previousGas = previousGasOf(run)
    if (!previousGas) return false
    return previousGas !== gas
  }

  const appendAscentTo = ({
    run,
    targetDepth,
    gas
  }: {
    run: AlgorithmRun
    targetDepth: number
    gas: Gas
  }): AlgorithmRun => {
    const startDepth = run.intervals[run.intervals.length - 1]?.finalDepth ?? 0
    if (startDepth === targetDepth) return run

    const duration = Math.abs(startDepth - targetDepth) / ascentRate
    const ascentSegment: DiveSegment = {
      type: DiveProfileIntervalType.ASCENT,
      initialDepth: startDepth,
      finalDepth: targetDepth,
      initialTime: run.runTime,
      finalTime: run.runTime + duration,
      gas,
      isGasSwitch: isSwitchFromPrevious(run, gas)
    }

    return {
      loads: compartmentIntegrator.advance({
        compartmentLoads: run.loads,
        segment: {
          initialDepth: startDepth,
          finalDepth: targetDepth,
          duration,
          gas
        }
      }),
      intervals: [...run.intervals, ascentSegment],
      runTime: ascentSegment.finalTime
    }
  }

  const holdAtStopUntilClearedFor = ({
    loads,
    stopDepth,
    nextStop,
    diveFirstStop,
    gas,
    minimumDurationMinutes
  }: {
    loads: CompartmentInertLoad[]
    stopDepth: number
    nextStop: number
    diveFirstStop: number
    gas: Gas
    minimumDurationMinutes: number
  }): { loads: CompartmentInertLoad[]; duration: number } => {
    const gradientFactor = effectiveGradientFactorAt({ depth: nextStop, diveFirstStop })
    const segmentTemplate = {
      initialDepth: stopDepth,
      finalDepth: stopDepth,
      duration: stopTimeStep,
      gas
    }

    let currentLoads = loads
    let elapsed = 0
    const safetyLimit = 10000 // ~16h at 0.1 min step — guard against runaway

    while (
      (ceilingDepthAt(currentLoads, gradientFactor) > nextStop || elapsed < minimumDurationMinutes) &&
      elapsed < safetyLimit
    ) {
      currentLoads = compartmentIntegrator.advance({
        compartmentLoads: currentLoads,
        segment: segmentTemplate
      })
      elapsed += stopTimeStep
    }

    return {
      loads: currentLoads,
      duration: ceilUpToWholeMinutes(elapsed, STOP_DURATION_ROUNDING_MINUTES)
    }
  }

  const appendStop = ({
    run,
    stopDepth,
    nextStop,
    diveFirstStop,
    backGas
  }: {
    run: AlgorithmRun
    stopDepth: number
    nextStop: number
    diveFirstStop: number
    backGas: Gas
  }): AlgorithmRun => {
    const gas = decoGasSelector.select({
      availableGases,
      backGas,
      ambientPressure: depthPressureConverter.depthToAmbientPressure(stopDepth)
    })

    // A stop where the breathing gas changes always gets at least a 1-min
    // hold so the diver has time to physically switch regulators — even if
    // Bühlmann's ceiling would let us blow through without stopping.
    const isSwitchStop = isSwitchFromPrevious(run, gas)
    const minimumDurationMinutes = isSwitchStop ? 1 : 0

    const { loads, duration } = holdAtStopUntilClearedFor({
      loads: run.loads,
      stopDepth,
      nextStop,
      diveFirstStop,
      gas,
      minimumDurationMinutes
    })

    // The ceiling already allowed ascent on arrival: emit no stop, the
    // orchestrator will ascend straight to the next shallower stop.
    if (duration === 0) return run

    const stopSegment: DiveSegment = {
      type: DiveProfileIntervalType.DECO_STOP,
      initialDepth: stopDepth,
      finalDepth: stopDepth,
      initialTime: run.runTime,
      finalTime: run.runTime + duration,
      gas,
      isGasSwitch: isSwitchFromPrevious(run, gas)
    }

    return {
      loads,
      intervals: [...run.intervals, stopSegment],
      runTime: stopSegment.finalTime
    }
  }

  const walkStops = ({
    runAfterFirstAscent,
    diveFirstStop,
    backGas
  }: {
    runAfterFirstAscent: AlgorithmRun
    diveFirstStop: number
    backGas: Gas
  }): AlgorithmRun => {
    let run = runAfterFirstAscent
    let stopDepth = diveFirstStop

    while (stopDepth >= lastStopDepth) {
      // From the last stop we jump straight to the surface, skipping any
      // shallower 3 m grid stop. Everywhere else we step one grid stop up.
      const nextStop = stopDepth === lastStopDepth ? 0 : nextShallowerStop(stopDepth)
      run = appendStop({ run, stopDepth, nextStop, diveFirstStop, backGas })
      const ascendingGas = previousGasOf(run) ?? backGas
      run = appendAscentTo({ run, targetDepth: nextStop, gas: ascendingGas })
      stopDepth = nextStop
    }

    return run
  }

  const calculateDiveProfileFromSegments = ({ segments }: AlgorithmInput): DiveProfile => {
    if (segments.length === 0) return { intervals: [] }

    const userRun = integrateUserSegments(segments)
    const lastSegment = userRun.intervals[userRun.intervals.length - 1]
    const backGas = lastSegment.gas

    // The first stop is the deeper of:
    //  (a) the natural Bühlmann ceiling rounded up to the 3 m grid, and
    //  (b) the deepest deco-gas switch depth (its MOD on the grid) —
    //      only when `switchAtMod` is enabled.
    // (b) is what produces the "switch to EAN50 at 21 m" stop even when
    // (a) would not naturally require a stop there.
    const naturalFirstStop = firstStopDepth(userRun.loads)
    const decoFirstStop = switchAtMod
      ? Math.max(naturalFirstStop, deepestGasSwitchDepth())
      : naturalFirstStop

    if (decoFirstStop <= 0) {
      const surfaceRun = appendAscentTo({ run: userRun, targetDepth: 0, gas: backGas })
      return { intervals: mergeConsecutiveAscents(surfaceRun.intervals) }
    }

    // If decompression is required, the first stop is never shallower than
    // the configured `lastStopDepth` — otherwise the deco phase would emit
    // no stops at all (a natural 3 m stop would be skipped by walkStops
    // when lastStopDepth = 6).
    const firstStop = Math.max(decoFirstStop, lastStopDepth)

    // The ascent from the bottom to the first deco stop stays on the back
    // gas. The gas switch to the richest safe deco gas happens AT the first
    // stop (and at any subsequent stop where a richer gas becomes safe).
    // Using the deco gas during this ascent would breathe a hyperoxic mix at
    // depth — a real-world fatal mistake.
    const runAfterFirstAscent = appendAscentTo({
      run: userRun,
      targetDepth: firstStop,
      gas: backGas
    })
    const runAfterStops = walkStops({
      runAfterFirstAscent,
      diveFirstStop: firstStop,
      backGas
    })

    return { intervals: mergeConsecutiveAscents(runAfterStops.intervals) }
  }

  // Legacy adapter: previous callers passed a bare `DiveSegment[]`.
  const fromSegments = (segments: DiveSegment[]): DiveProfile =>
    calculateDiveProfileFromSegments({ segments })

  return { calculateDiveProfileFromSegments: fromSegments }
}

export default createBuhlmannZHL16Algorithm()
