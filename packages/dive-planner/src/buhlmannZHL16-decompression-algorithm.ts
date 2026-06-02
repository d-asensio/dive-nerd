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
import { roundUpToStopGrid, nextShallowerStop, roundDownToStopGrid } from './stop-depth'
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
  /** `'CCR'` keeps the diluent on the loop at `setpointHigh` for the whole
   *  ascent and bypasses the OC deco-gas machinery. Defaults to `'OC'`. */
  circuit?: 'OC' | 'CCR'
  /** pO₂ setpoint (bar) held on ascent + deco in CCR mode. */
  setpointHigh?: number
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
  const circuit = options.circuit ?? 'OC'
  const setpointHigh = options.setpointHigh

  const compartmentIntegrator =
    dependencies.compartmentIntegrator ?? createCompartmentIntegrator(environment)
  const depthPressureConverter =
    dependencies.depthPressureConverter ?? createDepthPressureConverter(environment)
  const decoGasSelector = dependencies.decoGasSelector ?? createBestDecoGasSelector()
  const gasSwitchDepthCalculator =
    dependencies.gasSwitchDepthCalculator ??
    createGasSwitchDepthCalculator({ depthPressureConverter })

  const deepestGasSwitchDepth = (gases: Gas[]): number => {
    const switchDepths = gasSwitchDepthCalculator.switchDepthsOf(gases)
    if (switchDepths.length === 0) return 0
    return Math.max(...switchDepths)
  }

  /** Time-weighted average depth across the user's planned (pre-deco) segments. */
  const averageDepthOf = (segments: DiveSegment[]): number => {
    const totalTime = segments.reduce((sum, s) => sum + (s.finalTime - s.initialTime), 0)
    if (totalTime <= 0) return 0
    const weighted = segments.reduce(
      (sum, s) => sum + ((s.initialDepth + s.finalDepth) / 2) * (s.finalTime - s.initialTime),
      0
    )
    return weighted / totalTime
  }

  /**
   * Rule 1 (only relevant under `switchAtMod`): a deco gas whose MOD is deeper
   * than the dive's average bottom depth is not a sensible staged-deco gas for
   * this profile — forcing a "switch at MOD" there would put the switch near
   * (or below) where the diver actually spent the dive. Such gases are excluded
   * from the deco phase entirely, so the diver ascends on the back gas.
   */
  const gasesAfterDeepMODExclusion = (averageBottomDepth: number): Gas[] =>
    availableGases.filter(
      gas => !(gas.isDecoGas && gasSwitchDepthCalculator.modDepthOf(gas) > averageBottomDepth)
    )

  const integrateUserSegments = (segments: DiveSegment[]): AlgorithmRun =>
    segments.reduce<AlgorithmRun>(
      (run, segment) => ({
        loads: compartmentIntegrator.advance({
          compartmentLoads: run.loads,
          segment: {
            initialDepth: segment.initialDepth,
            finalDepth: segment.finalDepth,
            duration: segment.finalTime - segment.initialTime,
            gas: segment.gas,
            circuit: segment.circuit,
            setpoint: segment.setpoint
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
      isGasSwitch: isSwitchFromPrevious(run, gas),
      ...(circuit === 'CCR' ? { circuit, setpoint: setpointHigh } : {})
    }

    return {
      loads: compartmentIntegrator.advance({
        compartmentLoads: run.loads,
        segment: {
          initialDepth: startDepth,
          finalDepth: targetDepth,
          duration,
          gas,
          circuit,
          setpoint: setpointHigh
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
      gas,
      circuit,
      setpoint: setpointHigh
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
    backGas,
    decoGases
  }: {
    run: AlgorithmRun
    stopDepth: number
    nextStop: number
    diveFirstStop: number
    backGas: Gas
    decoGases: Gas[]
  }): AlgorithmRun => {
    const gas = circuit === 'CCR'
      ? backGas
      : decoGasSelector.select({
          availableGases: decoGases,
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
      isGasSwitch: isSwitchFromPrevious(run, gas),
      ...(circuit === 'CCR' ? { circuit, setpoint: setpointHigh } : {})
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
    backGas,
    decoGases
  }: {
    runAfterFirstAscent: AlgorithmRun
    diveFirstStop: number
    backGas: Gas
    decoGases: Gas[]
  }): AlgorithmRun => {
    let run = runAfterFirstAscent
    let stopDepth = diveFirstStop

    while (stopDepth >= lastStopDepth) {
      // From the last stop we jump straight to the surface, skipping any
      // shallower 3 m grid stop. Everywhere else we step one grid stop up.
      const nextStop = stopDepth === lastStopDepth ? 0 : nextShallowerStop(stopDepth)
      run = appendStop({ run, stopDepth, nextStop, diveFirstStop, backGas, decoGases })
      const ascendingGas = previousGasOf(run) ?? backGas
      run = appendAscentTo({ run, targetDepth: nextStop, gas: ascendingGas })
      stopDepth = nextStop
    }

    return run
  }

  /**
   * Runs the deco phase (ascent + stops down to the surface) from an arbitrary
   * seeded tissue state at a given depth/time. The user's bottom phase is *not*
   * included in the result — only the generated ascent/stop segments are
   * returned. This is the shared core behind both the normal plan and the CCR
   * bailout schedule (seeded with the loads captured at end of bottom time).
   *
   * A zero-length `NAVIGATION` seed marker is prepended so `appendAscentTo`
   * knows the starting depth/time and `isSwitchFromPrevious` has a previous gas;
   * it is sliced back off before returning.
   */
  const decompressFromState = ({
    loads,
    depth,
    time,
    backGas,
    decoGases
  }: {
    loads: CompartmentInertLoad[]
    depth: number
    time: number
    backGas: Gas
    decoGases: Gas[]
  }): DiveProfile => {
    const seededRun: AlgorithmRun = {
      loads,
      intervals: [{
        type: DiveProfileIntervalType.NAVIGATION,
        initialDepth: depth,
        finalDepth: depth,
        initialTime: time,
        finalTime: time,
        gas: backGas,
        ...(circuit === 'CCR' ? { circuit, setpoint: setpointHigh } : {})
      }],
      runTime: time
    }

    // The forced "switch at MOD" first stop is an open-circuit concept; on a
    // closed loop the diluent never switches, so it is disabled in CCR mode.
    const useSwitchAtMod = switchAtMod && circuit === 'OC'
    const naturalFirstStop = firstStopDepth(loads)
    const forcedSwitchDepth = Math.min(
      deepestGasSwitchDepth(decoGases),
      roundDownToStopGrid(depth)
    )
    const decoFirstStop = useSwitchAtMod
      ? Math.max(naturalFirstStop, forcedSwitchDepth)
      : naturalFirstStop

    if (decoFirstStop <= 0) {
      const surfaceRun = appendAscentTo({ run: seededRun, targetDepth: 0, gas: backGas })
      return { intervals: mergeConsecutiveAscents(surfaceRun.intervals.slice(1)) }
    }

    const firstStop = Math.max(decoFirstStop, lastStopDepth)
    const runAfterFirstAscent = appendAscentTo({ run: seededRun, targetDepth: firstStop, gas: backGas })
    const runAfterStops = walkStops({ runAfterFirstAscent, diveFirstStop: firstStop, backGas, decoGases })

    return { intervals: mergeConsecutiveAscents(runAfterStops.intervals.slice(1)) }
  }

  const calculateDiveProfileFromSegments = ({ segments }: AlgorithmInput): DiveProfile => {
    if (segments.length === 0) return { intervals: [] }

    const userRun = integrateUserSegments(segments)
    const lastSegment = userRun.intervals[userRun.intervals.length - 1]
    const backGas = lastSegment.gas
    const lastDepth = lastSegment.finalDepth

    // Rule 1 (OC switchAtMod only): drop deco gases whose MOD is deeper than the
    // dive's average bottom depth — they are not sensible staged-deco gases
    // here, so the diver should ascend on the back gas rather than switch. In
    // CCR mode there is no open-circuit deco-gas switching at all.
    const useSwitchAtMod = switchAtMod && circuit === 'OC'
    const decoGases = useSwitchAtMod
      ? gasesAfterDeepMODExclusion(averageDepthOf(userRun.intervals))
      : circuit === 'CCR' ? [] : availableGases

    const deco = decompressFromState({
      loads: userRun.loads,
      depth: lastDepth,
      time: userRun.runTime,
      backGas,
      decoGases
    })

    return { intervals: mergeConsecutiveAscents([...userRun.intervals, ...deco.intervals]) }
  }

  // Legacy adapter: previous callers passed a bare `DiveSegment[]`.
  const fromSegments = (segments: DiveSegment[]): DiveProfile =>
    calculateDiveProfileFromSegments({ segments })

  return {
    calculateDiveProfileFromSegments: fromSegments,
    decompressFromState,
    surfaceSaturatedLoads: compartmentIntegrator.initialCompartmentLoads
  }
}

export default createBuhlmannZHL16Algorithm()
