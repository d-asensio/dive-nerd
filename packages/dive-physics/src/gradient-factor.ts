/**
 * Linear interpolation of the effective gradient factor between the first
 * deco stop (`GF_low`) and the surface (`GF_high`).
 *
 * See `spec/buhlmann-16-zhl.md` §6.
 *
 *     GF(P) = GF_high + (GF_low − GF_high) · (P − P_surface) / (P_first_stop − P_surface)
 *
 * Clamped to `GF_low` when ambient pressure is deeper than the first stop
 * and to `GF_high` at or shallower than the surface. The clamp at depth is
 * what gives "loose" ascent ceilings during the descent / bottom phase.
 *
 * If `firstStopAmbientPressure ≤ surfaceAmbientPressure` (i.e. the dive
 * has no decompression obligation) the function returns `GF_high` for every
 * input — there is no "low end" to interpolate towards.
 */
export interface GradientFactorBounds {
  gfLow: number
  gfHigh: number
}

export const gradientFactorAt = ({
  bounds: { gfLow, gfHigh },
  firstStopAmbientPressure,
  surfaceAmbientPressure,
  ambientPressure
}: {
  bounds: GradientFactorBounds
  firstStopAmbientPressure: number
  surfaceAmbientPressure: number
  ambientPressure: number
}): number => {
  if (firstStopAmbientPressure <= surfaceAmbientPressure) return gfHigh
  if (ambientPressure >= firstStopAmbientPressure) return gfLow
  if (ambientPressure <= surfaceAmbientPressure) return gfHigh

  const depthFraction =
    (ambientPressure - surfaceAmbientPressure) /
    (firstStopAmbientPressure - surfaceAmbientPressure)

  return gfHigh + (gfLow - gfHigh) * depthFraction
}
