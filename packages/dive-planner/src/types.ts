export interface Gas {
  fO2: number
  fHe: number
  isDecoGas: boolean;
}

export interface DivePlanLevel {
  duration: number
  depth: number
  gas: Gas
}

export interface DivePlanSpeedOptions {
  descentRate: number,
  ascentRate: number
}

export interface DivePlanAlgorithmOptions {
  gradientFactorLow: number  // 0..1
  gradientFactorHigh: number // 0..1
  /**
   * When `true` (default), the algorithm forces a procedural stop at each
   * deco gas's MOD even if Bühlmann's ceiling would not otherwise require
   * one there. Matches the Subsurface / MultiDeco convention
   * ("EAN50 at 21 m, O₂ at 6 m").
   *
   * When `false`, gas switches happen at the first natural deco stop
   * where the new gas is safe — which can be shallower than its MOD.
   */
  switchAtMod: boolean
  /**
   * Depth (in meters, on the 3 m stop grid) of the **last** decompression
   * stop. Conventionally either `3` (default, universal Bühlmann) or `6`
   * (DAN / Marroni philosophy — skip the 3 m stop because gas elimination
   * there is marginal and the diver is in a higher-risk position).
   *
   * When the natural last stop would be shallower than this value, the
   * algorithm holds longer at `lastStopDepth` (until the surface ceiling
   * clears) and then ascends directly to the surface.
   */
  lastStopDepth: number
}

export interface DivePlanEnvironmentOptions {
  surfaceAmbientPressure: number // bar
  waterDensity: number           // kg/m³
  waterVaporPressure: number     // bar
}

export interface DivePlanCircuitOptions {
  /** `'OC'` (default) for open circuit, `'CCR'` for a constant-setpoint rebreather. */
  circuit: 'OC' | 'CCR'
  /** Diluent gas used on the loop in CCR mode. Ignored for OC. */
  diluent: Gas
  /** pO₂ setpoint (bar) held on descent + bottom in CCR mode. */
  setpointLow: number
  /** pO₂ setpoint (bar) held on ascent + deco in CCR mode. */
  setpointHigh: number
}

export type DivePlanOptions =
  DivePlanSpeedOptions
  & Partial<DivePlanAlgorithmOptions>
  & Partial<DivePlanEnvironmentOptions>
  & Partial<DivePlanCircuitOptions>

export interface DivePlan extends DivePlanOptions {
  levels: DivePlanLevel[]
  availableGases?: Gas[]
}

export enum DiveProfileIntervalType {
  DESCENT = 'DESCENT',
  NAVIGATION = 'NAVIGATION',
  ASCENT = 'ASCENT',
  DECO_STOP = 'DECO_STOP'
}

interface InertGasPartialPressures {
  ppN2: number
  ppHe: number
}

interface DiveProfileInterval {
  type: DiveProfileIntervalType

  duration: number // minutes
  depth: number // meters
  isGasSwitched: boolean
  gas: Gas

  ambientPressure: number // bars
  compartmentInertGasPartialPressures: InertGasPartialPressures[] // bars
  ceilingDepth: number // meters
}

export interface DiveProfile {
  intervals: DiveSegment[]
  /**
   * For CCR plans, the open-circuit bailout schedule computed from the end of
   * bottom time. Absent for OC plans.
   */
  bailout?: DiveProfile
}

export interface DiveSegment {
  type: DiveProfileIntervalType
  initialDepth: number
  finalDepth: number
  initialTime: number
  finalTime: number
  gas: Gas
  /** Circuit in force for this segment. Defaults to `'OC'` when absent. */
  circuit?: 'OC' | 'CCR'
  /** pO₂ setpoint (bar) for this segment. Only meaningful when `circuit === 'CCR'`. */
  setpoint?: number
  /**
   * `true` if this segment starts with a gas switch (the breathing gas
   * differs from the previous segment's gas). The user-supplied segments
   * produced by `levels-to-segments-interpolator` never set this flag; it
   * is populated by the decompression algorithm for the ascent / deco-stop
   * phase so the UI can render "switch to <gas> at <depth>" indicators.
   */
  isGasSwitch?: boolean
}
