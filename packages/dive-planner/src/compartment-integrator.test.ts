import { createCompartmentIntegrator } from './compartment-integrator'

describe('compartment integrator — CCR', () => {
  const environment = {
    surfaceAmbientPressure: 1.0133,
    waterDensity: 1023.6,
    waterVaporPressure: 0.0567
  }
  const air = { fO2: 0.21, fHe: 0, isDecoGas: false }

  it('loads less nitrogen on a CCR segment than the equivalent OC segment', () => {
    const integrator = createCompartmentIntegrator(environment)
    const start = integrator.initialCompartmentLoads()

    const ocLoads = integrator.advance({
      compartmentLoads: start,
      segment: { initialDepth: 40, finalDepth: 40, duration: 20, gas: air, circuit: 'OC' }
    })
    const ccrLoads = integrator.advance({
      compartmentLoads: start,
      segment: { initialDepth: 40, finalDepth: 40, duration: 20, gas: air, circuit: 'CCR', setpoint: 1.3 }
    })

    // On a held 1.3 setpoint the inspired N2 is lower than breathing air OC at
    // the same depth, so every compartment on-gasses less.
    expect(ccrLoads[0].nitrogenPartialPressure).toBeLessThan(ocLoads[0].nitrogenPartialPressure)
  })
})
