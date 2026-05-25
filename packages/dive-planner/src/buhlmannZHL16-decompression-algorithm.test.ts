/**
 * Acceptance tests for the Bühlmann ZH-L16C + GF algorithm.
 *
 * These dives are the verification cases listed in
 * `spec/buhlmann-16-zhl.md` §10. We do **not** assert exact minutes —
 * different reference planners (Subsurface, MultiDeco, V-Planner) disagree
 * with each other by a few minutes on the same dive depending on internal
 * conventions (water-vapour pressure, ascent rate between stops, ceiling
 * check timing, stop rounding). The bands below are wide enough to
 * accommodate that spread while still failing fast if the algorithm goes
 * structurally wrong.
 */
import { createBuhlmannZHL16Algorithm } from './buhlmannZHL16-decompression-algorithm'
import defaultLevelsToSegmentsInterpolator from './levels-to-segments-interpolator'
import { DiveProfileIntervalType, DiveSegment, Gas } from './types'

const air: Gas = { fO2: 0.21, fHe: 0, isDecoGas: false }
const ean32: Gas = { fO2: 0.32, fHe: 0, isDecoGas: false }
const ean50: Gas = { fO2: 0.5, fHe: 0, isDecoGas: true }
const oxygen: Gas = { fO2: 1, fHe: 0, isDecoGas: true }

const buildSegments = (levels: Array<{ depth: number; duration: number; gas: Gas }>): DiveSegment[] =>
  defaultLevelsToSegmentsInterpolator.interpolate(levels, { descentRate: 10, ascentRate: 9 })

const decoStopsOf = (intervals: DiveSegment[]) =>
  intervals.filter(({ type }) => type === DiveProfileIntervalType.DECO_STOP)

const totalDecoMinutes = (intervals: DiveSegment[]) =>
  decoStopsOf(intervals).reduce((sum, s) => sum + (s.finalTime - s.initialTime), 0)

const totalAscentTimeAfterBottom = (intervals: DiveSegment[]) => {
  const lastBottom = intervals
    .map((s, i) => ({ s, i }))
    .reverse()
    .find(({ s }) => s.type === DiveProfileIntervalType.NAVIGATION)
  if (!lastBottom) return 0
  const last = intervals[intervals.length - 1]
  return last.finalTime - lastBottom.s.finalTime
}

describe('Bühlmann ZH-L16C + GF — verification cases', () => {
  it('case 1: 18 m / 30 min on air @ GF 100/100 → no-stop dive', () => {
    // 18 m / 30 min on air is well inside the NDL for every published table.
    const algorithm = createBuhlmannZHL16Algorithm(
      {},
      { ascentRate: 9, gradientFactors: { gfLow: 1, gfHigh: 1 } }
    )

    const segments = buildSegments([{ depth: 18, duration: 30, gas: air }])
    const profile = algorithm.calculateDiveProfileFromSegments(segments)

    expect(decoStopsOf(profile.intervals)).toHaveLength(0)
    expect(profile.intervals[profile.intervals.length - 1].finalDepth).toBe(0)
  })

  it('case 2: 45 m / 25 min on air @ GF 30/85 → first stop in the 15–21 m band, total deco in 20–45 min', () => {
    const algorithm = createBuhlmannZHL16Algorithm(
      {},
      {
        ascentRate: 9,
        gradientFactors: { gfLow: 0.3, gfHigh: 0.85 }
      }
    )

    const segments = buildSegments([{ depth: 45, duration: 25, gas: air }])
    const profile = algorithm.calculateDiveProfileFromSegments(segments)

    const stops = decoStopsOf(profile.intervals)
    expect(stops.length).toBeGreaterThan(0)
    expect(stops[0].finalDepth).toBeGreaterThanOrEqual(15)
    expect(stops[0].finalDepth).toBeLessThanOrEqual(21)

    const totalDeco = totalDecoMinutes(profile.intervals)
    expect(totalDeco).toBeGreaterThanOrEqual(20)
    expect(totalDeco).toBeLessThanOrEqual(45)
  })

  it('case 3: 45 m / 25 min with EAN32 + EAN50 + O2 @ GF 30/85 → faster deco than air', () => {
    const algorithm = createBuhlmannZHL16Algorithm(
      {},
      {
        ascentRate: 9,
        gradientFactors: { gfLow: 0.3, gfHigh: 0.85 },
        availableGases: [ean50, oxygen]
      }
    )

    const segments = buildSegments([{ depth: 45, duration: 25, gas: ean32 }])
    const profile = algorithm.calculateDiveProfileFromSegments(segments)

    const stops = decoStopsOf(profile.intervals)
    expect(stops.length).toBeGreaterThan(0)
    expect(stops[stops.length - 1].gas).toBe(oxygen)

    // Should be markedly faster than the same dive on a single bottom gas.
    const algorithmAir = createBuhlmannZHL16Algorithm(
      {},
      { ascentRate: 9, gradientFactors: { gfLow: 0.3, gfHigh: 0.85 } }
    )
    const profileAir = algorithmAir.calculateDiveProfileFromSegments(
      buildSegments([{ depth: 45, duration: 25, gas: air }])
    )
    expect(totalDecoMinutes(profile.intervals)).toBeLessThan(totalDecoMinutes(profileAir.intervals))
  })

  describe('lastStopDepth option', () => {
    const baseOptions = {
      ascentRate: 9,
      gradientFactors: { gfLow: 0.3, gfHigh: 0.85 },
      availableGases: [ean50, oxygen]
    }
    const segments = buildSegments([{ depth: 45, duration: 25, gas: air }])

    it('ends the deco phase at the 3 m stop by default', () => {
      const algorithm = createBuhlmannZHL16Algorithm({}, baseOptions)
      const profile = algorithm.calculateDiveProfileFromSegments(segments)

      const stops = profile.intervals.filter(
        s => s.type === DiveProfileIntervalType.DECO_STOP
      )
      const lastStop = stops[stops.length - 1]
      expect(lastStop.finalDepth).toBe(3)
    })

    it('ends the deco phase at 6 m and skips the 3 m stop when lastStopDepth=6', () => {
      const algorithm = createBuhlmannZHL16Algorithm(
        {},
        { ...baseOptions, lastStopDepth: 6 }
      )
      const profile = algorithm.calculateDiveProfileFromSegments(segments)

      const stops = profile.intervals.filter(
        s => s.type === DiveProfileIntervalType.DECO_STOP
      )
      const stopDepths = stops.map(s => s.finalDepth)
      expect(stopDepths).not.toContain(3)
      expect(stops[stops.length - 1].finalDepth).toBe(6)
    })

    it('holds longer at the 6 m stop to compensate for the skipped 3 m stop', () => {
      const algorithmDefault = createBuhlmannZHL16Algorithm({}, baseOptions)
      const algorithmAt6     = createBuhlmannZHL16Algorithm({}, { ...baseOptions, lastStopDepth: 6 })

      const stop6mDefault = algorithmDefault
        .calculateDiveProfileFromSegments(segments)
        .intervals
        .find(s => s.type === DiveProfileIntervalType.DECO_STOP && s.finalDepth === 6)
      const stop6mAt6 = algorithmAt6
        .calculateDiveProfileFromSegments(segments)
        .intervals
        .find(s => s.type === DiveProfileIntervalType.DECO_STOP && s.finalDepth === 6)

      expect(stop6mDefault).toBeDefined()
      expect(stop6mAt6).toBeDefined()
      const defaultDuration = stop6mDefault!.finalTime - stop6mDefault!.initialTime
      const at6Duration     = stop6mAt6!.finalTime - stop6mAt6!.initialTime
      expect(at6Duration).toBeGreaterThan(defaultDuration)
    })

    it('ends every dive at the surface regardless of lastStopDepth', () => {
      const algorithm = createBuhlmannZHL16Algorithm(
        {},
        { ...baseOptions, lastStopDepth: 6 }
      )
      const profile = algorithm.calculateDiveProfileFromSegments(segments)

      expect(profile.intervals[profile.intervals.length - 1].finalDepth).toBe(0)
    })
  })

  describe('gas switching', () => {
    const algorithmWithDecoGases = createBuhlmannZHL16Algorithm(
      {},
      {
        ascentRate: 9,
        gradientFactors: { gfLow: 0.3, gfHigh: 0.85 },
        availableGases: [ean50, oxygen]
      }
    )

    it('breathes the back gas during the entire ascent from the bottom to the first stop', () => {
      const segments = buildSegments([{ depth: 45, duration: 25, gas: air }])
      const profile = algorithmWithDecoGases.calculateDiveProfileFromSegments(segments)

      const firstAscent = profile.intervals.find(
        s => s.type === DiveProfileIntervalType.ASCENT && s.initialDepth === 45
      )
      expect(firstAscent).toBeDefined()
      expect(firstAscent!.gas).toBe(air)
      expect(firstAscent!.isGasSwitch).toBe(false)
    })

    it('switches to EAN50 at the first stop where it is safe (and flags the switch)', () => {
      const segments = buildSegments([{ depth: 45, duration: 25, gas: air }])
      const profile = algorithmWithDecoGases.calculateDiveProfileFromSegments(segments)

      const firstStop = profile.intervals.find(
        s => s.type === DiveProfileIntervalType.DECO_STOP
      )
      expect(firstStop).toBeDefined()
      expect(firstStop!.gas).toBe(ean50)
      expect(firstStop!.isGasSwitch).toBe(true)
    })

    it('places the first stop at the EAN50 switch depth (21 m) even when the natural ceiling is shallower', () => {
      // 45 m / 25 min air at GF 30/85 naturally puts the first stop at
      // 18 m. With EAN50 available, we expect the first stop to be lifted
      // up to 21 m so the diver can perform the gas switch at MOD.
      const segments = buildSegments([{ depth: 45, duration: 25, gas: air }])
      const profile = algorithmWithDecoGases.calculateDiveProfileFromSegments(segments)

      const firstStop = profile.intervals.find(
        s => s.type === DiveProfileIntervalType.DECO_STOP
      )
      expect(firstStop!.finalDepth).toBe(21)
      expect(firstStop!.gas).toBe(ean50)
      expect(firstStop!.isGasSwitch).toBe(true)
      expect(firstStop!.finalTime - firstStop!.initialTime).toBeGreaterThanOrEqual(1)
    })

    // The `switchAtMod` toggle's effect is only visible on dives where the
    // natural ceiling is **shallower** than the deepest deco gas MOD. We
    // use 30 m / 25 min on air @ GF 50/85 — a mild dive whose natural
    // first stop is at 6 m — to highlight the difference cleanly.
    describe('switchAtMod toggle (30 m / 25 min air @ GF 50/85)', () => {
      const segments = buildSegments([{ depth: 30, duration: 25, gas: air }])
      const baseOptions = {
        ascentRate: 9,
        gradientFactors: { gfLow: 0.5, gfHigh: 0.85 },
        availableGases: [ean50, oxygen]
      }

      it('with switchAtMod=true, lifts the first stop up to EAN50\'s MOD (21 m)', () => {
        const algorithm = createBuhlmannZHL16Algorithm({}, { ...baseOptions, switchAtMod: true })
        const profile = algorithm.calculateDiveProfileFromSegments(segments)

        const firstStop = profile.intervals.find(
          s => s.type === DiveProfileIntervalType.DECO_STOP
        )
        expect(firstStop!.finalDepth).toBe(21)
        expect(firstStop!.gas).toBe(ean50)
      })

      it('with switchAtMod=false, the first stop stays at the natural ceiling (9 m), well above EAN50\'s MOD', () => {
        const algorithm = createBuhlmannZHL16Algorithm({}, { ...baseOptions, switchAtMod: false })
        const profile = algorithm.calculateDiveProfileFromSegments(segments)

        const firstStop = profile.intervals.find(
          s => s.type === DiveProfileIntervalType.DECO_STOP
        )
        // The natural ceiling at GF_low=0.5 rounds up to 9 m. Without MOD
        // forcing, the algorithm does not lift the first stop up to 21 m.
        expect(firstStop!.finalDepth).toBe(9)
        expect(firstStop!.finalDepth).toBeLessThan(21)
        expect(firstStop!.gas).toBe(ean50)
      })

      it('defaults to switchAtMod=true when the option is omitted', () => {
        const algorithm = createBuhlmannZHL16Algorithm({}, baseOptions)
        const profile = algorithm.calculateDiveProfileFromSegments(segments)

        const firstStop = profile.intervals.find(
          s => s.type === DiveProfileIntervalType.DECO_STOP
        )
        expect(firstStop!.finalDepth).toBe(21)
      })
    })

    it('switches to O2 at the 6 m stop (and flags the switch)', () => {
      const segments = buildSegments([{ depth: 45, duration: 25, gas: air }])
      const profile = algorithmWithDecoGases.calculateDiveProfileFromSegments(segments)

      const sixMeterStop = profile.intervals.find(
        s => s.type === DiveProfileIntervalType.DECO_STOP && s.finalDepth === 6
      )
      expect(sixMeterStop).toBeDefined()
      expect(sixMeterStop!.gas).toBe(oxygen)
      expect(sixMeterStop!.isGasSwitch).toBe(true)
    })

    it('does not flag a gas switch when the gas stays the same between consecutive segments', () => {
      const segments = buildSegments([{ depth: 45, duration: 25, gas: air }])
      const profile = algorithmWithDecoGases.calculateDiveProfileFromSegments(segments)

      // The 3 m stop is the second one breathed on O2 (after the 6 m stop +
      // its ascent up to 3 m). The ascent and stop here must NOT be flagged
      // as a switch.
      const threeMeterStop = profile.intervals.find(
        s => s.type === DiveProfileIntervalType.DECO_STOP && s.finalDepth === 3
      )
      expect(threeMeterStop).toBeDefined()
      expect(threeMeterStop!.gas).toBe(oxygen)
      expect(threeMeterStop!.isGasSwitch).toBe(false)
    })

    it('falls back to the back gas when no deco gas is safe at the first stop', () => {
      // Deep first stop: only an exotic deco gas safe at 30 m would qualify;
      // EAN50 is not safe that deep.
      const algorithm = createBuhlmannZHL16Algorithm(
        {},
        {
          ascentRate: 9,
          gradientFactors: { gfLow: 0.2, gfHigh: 0.85 },
          availableGases: [ean50]
        }
      )
      const segments = buildSegments([{ depth: 60, duration: 25, gas: air }])
      const profile = algorithm.calculateDiveProfileFromSegments(segments)

      const firstStop = profile.intervals.find(
        s => s.type === DiveProfileIntervalType.DECO_STOP
      )
      expect(firstStop).toBeDefined()
      // The first stop is too deep for EAN50 — we keep breathing air.
      if (firstStop!.finalDepth > 21) {
        expect(firstStop!.gas).toBe(air)
        expect(firstStop!.isGasSwitch).toBe(false)
      }
    })
  })

  it('never emits two consecutive ASCENT segments on the same gas (merged)', () => {
    const algorithm = createBuhlmannZHL16Algorithm(
      {},
      {
        ascentRate: 9,
        gradientFactors: { gfLow: 0.3, gfHigh: 0.85 },
        availableGases: [ean50, oxygen]
      }
    )
    const segments = buildSegments([{ depth: 45, duration: 25, gas: air }])
    const profile = algorithm.calculateDiveProfileFromSegments(segments)

    profile.intervals.forEach((segment, index) => {
      const previous = profile.intervals[index - 1]
      if (!previous) return
      const bothAscent =
        segment.type === DiveProfileIntervalType.ASCENT &&
        previous.type === DiveProfileIntervalType.ASCENT
      const sameGas = segment.gas === previous.gas
      expect(bothAscent && sameGas).toBe(false)
    })
  })

  it('produces a final ascent ending at the surface for every dive', () => {
    const algorithm = createBuhlmannZHL16Algorithm(
      {},
      { ascentRate: 9, gradientFactors: { gfLow: 0.3, gfHigh: 0.85 } }
    )
    const segments = buildSegments([{ depth: 40, duration: 20, gas: air }])

    const profile = algorithm.calculateDiveProfileFromSegments(segments)

    expect(profile.intervals[profile.intervals.length - 1].finalDepth).toBe(0)
    expect(totalAscentTimeAfterBottom(profile.intervals)).toBeGreaterThan(0)
  })
})
