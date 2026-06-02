import { inspiredInertGas } from './breathing-source'

// Trimix 18/45 — fO2 0.18, fHe 0.45, fN2 0.37
const trimix = { fO2: 0.18, fHe: 0.45 }
const air = { fO2: 0.21, fHe: 0 }
const Pwv = 0.0567

describe('inspiredInertGas — open circuit', () => {
  it('matches (Pa - Pwv) * Fig for nitrogen and helium', () => {
    const result = inspiredInertGas({
      circuit: 'OC',
      ambientPressure: 4,
      waterVaporPressure: Pwv,
      gas: trimix
    })

    expect(result.nitrogen).toBeCloseTo((4 - Pwv) * 0.37, 6)
    expect(result.helium).toBeCloseTo((4 - Pwv) * 0.45, 6)
  })

  it('exposes the gas fractions as change-rate factors', () => {
    const result = inspiredInertGas({
      circuit: 'OC',
      ambientPressure: 4,
      waterVaporPressure: Pwv,
      gas: trimix
    })

    expect(result.nitrogenChangeRateFactor).toBeCloseTo(0.37, 6)
    expect(result.heliumChangeRateFactor).toBeCloseTo(0.45, 6)
    expect(result.setpointUnsustainable).toBe(false)
  })
})

describe('inspiredInertGas — closed circuit', () => {
  it('reduces to (Pa - setpoint - Pwv) for an air diluent (factor = 1)', () => {
    const result = inspiredInertGas({
      circuit: 'CCR',
      ambientPressure: 4,
      waterVaporPressure: Pwv,
      gas: air,
      setpoint: 1.3
    })

    expect(result.nitrogen).toBeCloseTo(4 - 1.3 - Pwv, 6)
    expect(result.helium).toBeCloseTo(0, 6)
    expect(result.nitrogenChangeRateFactor).toBeCloseTo(1, 6)
  })

  it('splits the inert pressure by the diluent inert ratio for trimix', () => {
    const result = inspiredInertGas({
      circuit: 'CCR',
      ambientPressure: 4,
      waterVaporPressure: Pwv,
      gas: trimix,
      setpoint: 1.3
    })

    const base = 4 - 1.3 - Pwv
    const denom = 1 - 0.18 // 0.82
    expect(result.nitrogenChangeRateFactor).toBeCloseTo(0.37 / denom, 6)
    expect(result.heliumChangeRateFactor).toBeCloseTo(0.45 / denom, 6)
    expect(result.nitrogen).toBeCloseTo((0.37 / denom) * base, 6)
    expect(result.helium).toBeCloseTo((0.45 / denom) * base, 6)
  })

  it('clamps inert pressure to zero and flags when ambient cannot hold the setpoint', () => {
    const result = inspiredInertGas({
      circuit: 'CCR',
      ambientPressure: 1.2,
      waterVaporPressure: Pwv,
      gas: air,
      setpoint: 1.3
    })

    expect(result.nitrogen).toBe(0)
    expect(result.helium).toBe(0)
    expect(result.setpointUnsustainable).toBe(true)
  })

  it('treats the exact boundary (Pa === setpoint + Pwv) as unsustainable', () => {
    const result = inspiredInertGas({
      circuit: 'CCR',
      ambientPressure: 1.3 + Pwv,
      waterVaporPressure: Pwv,
      gas: air,
      setpoint: 1.3
    })

    expect(result.nitrogen).toBe(0)
    expect(result.setpointUnsustainable).toBe(true)
  })
})
