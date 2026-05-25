/**
 * Merges consecutive `ASCENT` segments that share the same breathing gas
 * into a single segment.
 *
 * The decompression algorithm walks the 3 m stop grid one step at a time
 * and emits an `ASCENT` segment between each pair of grid stops. When a
 * would-be stop has zero clearance time and no gas switch, the algorithm
 * correctly skips emitting the `DECO_STOP` — but the two surrounding
 * `ASCENT` segments are left as separate intervals even though they are
 * now functionally one continuous ascent on the same gas.
 *
 * This helper collapses those into one segment so the dive narrative is
 * canonical: a single `ASCENT` row reaching the next actually-held stop.
 *
 * Scope is intentionally narrow:
 * - Only `ASCENT`–`ASCENT` pairs are merged. `DESCENT` happens once at
 *   dive start, `NAVIGATION` is user-defined per level and `DECO_STOP`
 *   segments at the same depth never appear consecutively in the
 *   current algorithm.
 * - Adjacent segments must share the same `gas` reference (identity, not
 *   structural equality) — a switch always lands on a `DECO_STOP` in our
 *   algorithm, so two ASCENTs on the same gas can never straddle a gas
 *   switch.
 *
 * `isGasSwitch` is preserved from the first segment of each merged run.
 */
import { DiveProfileIntervalType, DiveSegment } from './types'

const canMerge = (previous: DiveSegment, current: DiveSegment): boolean =>
  previous.type === DiveProfileIntervalType.ASCENT
  && current.type === DiveProfileIntervalType.ASCENT
  && previous.gas === current.gas

const mergedWith = (previous: DiveSegment, current: DiveSegment): DiveSegment => ({
  ...previous,
  finalDepth: current.finalDepth,
  finalTime: current.finalTime
})

export const mergeConsecutiveAscents = (intervals: DiveSegment[]): DiveSegment[] =>
  intervals.reduce<DiveSegment[]>((acc, segment) => {
    const previous = acc[acc.length - 1]
    if (previous && canMerge(previous, segment)) {
      return [...acc.slice(0, -1), mergedWith(previous, segment)]
    }
    return [...acc, segment]
  }, [])
