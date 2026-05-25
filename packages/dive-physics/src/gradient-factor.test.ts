import { gradientFactorAt } from './gradient-factor'

describe('gradientFactorAt', () => {
  const bounds = { gfLow: 0.3, gfHigh: 0.85 }
  const surfaceAmbientPressure = 1.0133
  const firstStopAmbientPressure = 2.8 // ~ 18 msw

  it('returns gfLow at the first stop ambient pressure', () => {
    const result = gradientFactorAt({
      bounds,
      firstStopAmbientPressure,
      surfaceAmbientPressure,
      ambientPressure: firstStopAmbientPressure
    })

    expect(result).toBeCloseTo(bounds.gfLow, 6)
  })

  it('returns gfHigh at the surface', () => {
    const result = gradientFactorAt({
      bounds,
      firstStopAmbientPressure,
      surfaceAmbientPressure,
      ambientPressure: surfaceAmbientPressure
    })

    expect(result).toBeCloseTo(bounds.gfHigh, 6)
  })

  it('clamps to gfLow deeper than the first stop', () => {
    const result = gradientFactorAt({
      bounds,
      firstStopAmbientPressure,
      surfaceAmbientPressure,
      ambientPressure: 5
    })

    expect(result).toBe(bounds.gfLow)
  })

  it('clamps to gfHigh shallower than the surface (decompressing on land?)', () => {
    const result = gradientFactorAt({
      bounds,
      firstStopAmbientPressure,
      surfaceAmbientPressure,
      ambientPressure: 0.5
    })

    expect(result).toBe(bounds.gfHigh)
  })

  it('interpolates linearly between the first stop and the surface', () => {
    const midAmbient = (firstStopAmbientPressure + surfaceAmbientPressure) / 2

    const result = gradientFactorAt({
      bounds,
      firstStopAmbientPressure,
      surfaceAmbientPressure,
      ambientPressure: midAmbient
    })

    const expected = (bounds.gfLow + bounds.gfHigh) / 2
    expect(result).toBeCloseTo(expected, 6)
  })

  it('returns gfHigh everywhere when the dive has no decompression obligation', () => {
    const result = gradientFactorAt({
      bounds,
      firstStopAmbientPressure: surfaceAmbientPressure,
      surfaceAmbientPressure,
      ambientPressure: 3
    })

    expect(result).toBe(bounds.gfHigh)
  })
})
