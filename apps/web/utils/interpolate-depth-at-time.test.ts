import { depthAtTime } from "@/utils/interpolate-depth-at-time";

describe('depthAtTime', () => {
  it('returns the exact depth at a sample point', () => {
    const samples = [{ x: 0, y: 0 }, { x: 10, y: 40 }]
    expect(depthAtTime(samples, 10)).toBe(40)
  })

  it('linearly interpolates between two bracketing samples', () => {
    const samples = [{ x: 0, y: 0 }, { x: 10, y: 40 }]
    expect(depthAtTime(samples, 5)).toBe(20)
  })

  it('interpolates on the ascending segment of a multi-segment profile', () => {
    // descent to 40 m, bottom, ascent back to surface
    const samples = [{ x: 0, y: 0 }, { x: 2, y: 40 }, { x: 6, y: 40 }, { x: 10, y: 0 }]
    expect(depthAtTime(samples, 8)).toBe(20)
  })

  it('clamps to the first depth below the time range', () => {
    const samples = [{ x: 2, y: 5 }, { x: 10, y: 40 }]
    expect(depthAtTime(samples, -3)).toBe(5)
  })

  it('clamps to the last depth above the time range', () => {
    const samples = [{ x: 0, y: 0 }, { x: 10, y: 40 }]
    expect(depthAtTime(samples, 99)).toBe(40)
  })

  it('returns the only sample depth when there is a single sample', () => {
    expect(depthAtTime([{ x: 4, y: 12 }], 7)).toBe(12)
  })

  it('returns 0 when there are no samples', () => {
    expect(depthAtTime([], 5)).toBe(0)
  })
})
