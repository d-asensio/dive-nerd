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

// interface DivePlanAlgorithmOptions {
//   gradientFactors: [number, number]
// }

export type DivePlanOptions =
  DivePlanSpeedOptions
// & DivePlanAlgorithmOptions

export interface DivePlan extends DivePlanOptions {
  levels: DivePlanLevel[]
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
  // runTime: number
  // decoTime: number
  // averageDepth: number
  // intervals: DiveProfileInterval[]
  intervals: DiveSegment[]
}

export interface DiveSegment {
  type: DiveProfileIntervalType
  initialDepth: number
  finalDepth: number
  initialTime: number
  finalTime: number
  gas: Gas
}
