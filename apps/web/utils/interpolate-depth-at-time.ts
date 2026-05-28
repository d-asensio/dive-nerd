interface Sample {
  x: number // time (minutes), assumed sorted ascending
  y: number // depth (meters)
}

/**
 * Linearly interpolates the profile depth at a given time. Used to project the
 * cursor's time onto the dive profile line. Times outside the sampled range are
 * clamped to the first/last sample.
 */
export const depthAtTime = (samples: Sample[], time: number): number => {
  if (samples.length === 0) return 0
  if (time <= samples[0].x) return samples[0].y

  const last = samples[samples.length - 1]
  if (time >= last.x) return last.y

  for (let i = 1; i < samples.length; i++) {
    const previous = samples[i - 1]
    const current = samples[i]
    if (time <= current.x) {
      const span = current.x - previous.x
      if (span === 0) return current.y
      const ratio = (time - previous.x) / span
      return previous.y + ratio * (current.y - previous.y)
    }
  }

  return last.y
}
