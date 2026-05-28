interface TimedSegment<G> {
  initialTime: number
  finalTime: number
  gas: G
}

/**
 * Returns the breathing gas in effect at a given time. Gas is piecewise
 * constant per dive segment; the time is matched to the first segment whose
 * `finalTime` it does not exceed, and clamped to the last segment beyond the
 * profile's end.
 */
export const gasAtTime = <G>(segments: TimedSegment<G>[], time: number): G | null => {
  if (segments.length === 0) return null

  for (const segment of segments) {
    if (time <= segment.finalTime) return segment.gas
  }

  return segments[segments.length - 1].gas
}
