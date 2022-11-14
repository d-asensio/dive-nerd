
const BUHLMANN_ALVEOLAR_PRESSURE = 0.627 // in msw
const initialAmbientPressure = 10 // in msw (1bar = 10msw)

export const intervals = [
  {
    // This is the first interval, starting from the surface
    // thus, the calculations are made considering nitrogen
    // surface full saturation. And helium is 0 because air
    // does not contain any.
    initialCompartmentPressures: [
      {
        name: '1',
        inertGasPressures: {
          pN2: (33 - 2.042) * 0.79,
          pHe: 0
        }
      }
    ],
    // at the surface of sea level, thus
    // 33 fsw to account for atmospheric pressure
    initialAmbientPressure: 0 + 33,
    endAmbientPressure: 120,
    descentRate: 60 // fsw/min
  }
]

export const profile = {
  // This is for a "first dive" in which tissues are completely saturated with nitrogen
  initialCompartmentPressures: {
    1: {
      pN2: (initialAmbientPressure - BUHLMANN_ALVEOLAR_PRESSURE) * 0.79, // 7.40467 msw
      pHe: 0 // in msw
    }
  },
  samples: [
    {
      time: 0, // in seconds
      depth: 1.51, // in meters
      temperature: 22, // in celsius
      gasMixture: {
        O2: 0.3, // Unitless Ratio
        N2: 0.7, // Unitless Ratio
        He: 0 // Unitless Ratio
      }
    }
  ]
}
