/**
 * Equivalent Narcotic Depth (END) — the depth at which breathing air would
 * produce the same narcotic load as breathing this mix at the given ambient
 * pressure.
 *
 * The convention used here treats both nitrogen and oxygen as narcotic and
 * only helium as non-narcotic (the standard Bühlmann / GUE assumption). The
 * narcotic-equivalent pressure is therefore:
 *
 *   P_narc = P_ambient · (1 − fHe)
 *
 * which is then converted to a depth via the inverse of the hydrostatic
 * pressure-from-depth relation (using the supplied surface ambient pressure,
 * water density and standard gravity). Negative results — possible when the
 * narcotic-equivalent pressure dips below atmospheric for very He-rich mixes
 * near the surface — are clamped to 0.
 */
const GRAVITY = 9.80665 // m/s²
const BAR_TO_PASCAL = 100000

export const equivalentNarcoticDepth = ({
  heliumFraction: fHe,
  ambientPressure: Pa,
  surfaceAmbientPressure: Ps,
  waterDensity: Wd,
}: {
  heliumFraction: number
  ambientPressure: number
  surfaceAmbientPressure: number
  waterDensity: number
}): number => {
  const narcoticPressure = Pa * (1 - fHe)
  const depth = ((narcoticPressure - Ps) * BAR_TO_PASCAL) / (Wd * GRAVITY)
  return Math.max(0, depth)
}
