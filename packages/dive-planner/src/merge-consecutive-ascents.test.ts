import { mergeConsecutiveAscents } from './merge-consecutive-ascents'
import { DiveProfileIntervalType, DiveSegment, Gas } from './types'

const air: Gas = { fO2: 0.21, fHe: 0, isDecoGas: false }
const ean50: Gas = { fO2: 0.5, fHe: 0, isDecoGas: true }

const ascent = (overrides: Partial<DiveSegment> = {}): DiveSegment => ({
  type: DiveProfileIntervalType.ASCENT,
  initialDepth: 21,
  finalDepth: 18,
  initialTime: 30,
  finalTime: 30.33,
  gas: air,
  ...overrides
})

const decoStop = (overrides: Partial<DiveSegment> = {}): DiveSegment => ({
  type: DiveProfileIntervalType.DECO_STOP,
  initialDepth: 21,
  finalDepth: 21,
  initialTime: 28,
  finalTime: 30,
  gas: air,
  ...overrides
})

describe('mergeConsecutiveAscents', () => {
  it('returns an empty list unchanged', () => {
    expect(mergeConsecutiveAscents([])).toEqual([])
  })

  it('returns a single-segment list unchanged', () => {
    const single = [ascent()]
    expect(mergeConsecutiveAscents(single)).toEqual(single)
  })

  it('merges two consecutive ASCENTs on the same gas into one', () => {
    const intervals: DiveSegment[] = [
      ascent({ initialDepth: 21, finalDepth: 18, initialTime: 30, finalTime: 30.33 }),
      ascent({ initialDepth: 18, finalDepth: 15, initialTime: 30.33, finalTime: 30.67 })
    ]

    const result = mergeConsecutiveAscents(intervals)

    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      type: DiveProfileIntervalType.ASCENT,
      initialDepth: 21,
      finalDepth: 15,
      initialTime: 30,
      finalTime: 30.67,
      gas: air
    })
  })

  it('merges three consecutive ASCENTs on the same gas into one', () => {
    const intervals: DiveSegment[] = [
      ascent({ initialDepth: 21, finalDepth: 18, initialTime: 30, finalTime: 30.33 }),
      ascent({ initialDepth: 18, finalDepth: 15, initialTime: 30.33, finalTime: 30.67 }),
      ascent({ initialDepth: 15, finalDepth: 12, initialTime: 30.67, finalTime: 31.00 })
    ]

    const result = mergeConsecutiveAscents(intervals)

    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      initialDepth: 21,
      finalDepth: 12,
      initialTime: 30,
      finalTime: 31.00
    })
  })

  it('does not merge across a DECO_STOP', () => {
    const intervals: DiveSegment[] = [
      ascent({ initialDepth: 21, finalDepth: 18, finalTime: 30.33 }),
      decoStop({ initialDepth: 18, finalDepth: 18, initialTime: 30.33, finalTime: 31.33 }),
      ascent({ initialDepth: 18, finalDepth: 15, initialTime: 31.33, finalTime: 31.67 })
    ]

    const result = mergeConsecutiveAscents(intervals)

    expect(result).toHaveLength(3)
    expect(result.map(s => s.type)).toEqual([
      DiveProfileIntervalType.ASCENT,
      DiveProfileIntervalType.DECO_STOP,
      DiveProfileIntervalType.ASCENT
    ])
  })

  it('does not merge two ASCENTs that breathe different gases', () => {
    const intervals: DiveSegment[] = [
      ascent({ gas: air }),
      ascent({ initialDepth: 18, finalDepth: 15, gas: ean50 })
    ]

    const result = mergeConsecutiveAscents(intervals)

    expect(result).toHaveLength(2)
    expect(result[0].gas).toBe(air)
    expect(result[1].gas).toBe(ean50)
  })

  it('preserves isGasSwitch from the first segment of a merged run', () => {
    const intervals: DiveSegment[] = [
      ascent({ initialDepth: 21, finalDepth: 18, isGasSwitch: true }),
      ascent({ initialDepth: 18, finalDepth: 15 })
    ]

    const [merged] = mergeConsecutiveAscents(intervals)

    expect(merged.isGasSwitch).toBe(true)
  })
})
