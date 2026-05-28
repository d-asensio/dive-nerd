import { gasAtTime } from "@/utils/gas-at-time";

const segment = (initialTime: number, finalTime: number, gas: string) => ({
  initialTime,
  finalTime,
  gas,
})

describe('gasAtTime', () => {
  it('returns the gas of the segment containing the time', () => {
    const segments = [segment(0, 5, 'air'), segment(5, 10, 'ean50')]
    expect(gasAtTime(segments, 3)).toBe('air')
    expect(gasAtTime(segments, 7)).toBe('ean50')
  })

  it('returns the earlier segment gas exactly on a boundary', () => {
    const segments = [segment(0, 5, 'air'), segment(5, 10, 'ean50')]
    expect(gasAtTime(segments, 5)).toBe('air')
  })

  it('clamps to the last segment gas past the end', () => {
    const segments = [segment(0, 5, 'air'), segment(5, 10, 'ean50')]
    expect(gasAtTime(segments, 99)).toBe('ean50')
  })

  it('returns null when there are no segments', () => {
    expect(gasAtTime([], 3)).toBeNull()
  })
})
