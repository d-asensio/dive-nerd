interface Gas {
  fO2: number
  fHe: number
}

interface DiveLevel {
  duration: number
  depth: number
  gas: Gas
}

interface DivePlan {
  descentRate: number
  ascentRate: number
  gradientFactors: [number, number]
  bottomLevels: DiveLevel[]
}

enum DiveProfileIntervalType {
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

interface DiveProfile {
  runTime: number
  decoTime: number
  averageDepth: number
  intervals: DiveProfileInterval[]
}

interface DiveSegment {
  initialDepth: number
  depthDelta: number
  timeDelta: number
}

interface DecompressionAlgorithm {
  calculateDiveProfileFromSegments: (segments: DiveSegment) => DiveProfile
}

interface DivePlannerDependencies {
  decompressionAlgorithm: DecompressionAlgorithm
}

interface DivePlanner {
  calculateDiveProfileFromPlan: (configuration: DivePlan) => DiveProfile
}

type DivePlannerFactoryFn =
  (dependencies: DivePlannerDependencies) => DivePlanner
