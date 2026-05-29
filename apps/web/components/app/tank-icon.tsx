import * as React from "react"

import {TankMaterial} from "@/utils/tank-library"
import {cn} from "@/lib/utils"

/**
 * Stylised diving cylinder. The shape — neck, shoulder, body, base — is fixed
 * by a parameterised SVG path; the *taller* the cylinder visually, the bigger
 * the water-volume. Material drives the fill (silvery for aluminium, slate for
 * steel).
 *
 * Renders inside the parent's font-size box (1em tall by default) so it sits
 * inline with row text. The width is derived from the aspect ratio.
 */
const MATERIAL_FILL: Record<TankMaterial, string> = {
  aluminium: "#cbd5e1", // slate-300 — light, brushed
  steel:     "#475569", // slate-600 — darker
}

const MATERIAL_STROKE: Record<TankMaterial, string> = {
  aluminium: "#94a3b8", // slate-400
  steel:     "#1e293b", // slate-800
}

interface TankIconProps extends React.SVGProps<SVGSVGElement> {
  waterVolumeLiters: number
  material: TankMaterial
  /** Twinsets carry two cylinders manifolded together — render side-by-side. */
  doubled?: boolean
}

export function TankIcon({
  waterVolumeLiters,
  material,
  doubled = false,
  className,
  ...props
}: TankIconProps) {
  // Map litres → visual height. Roughly: AL40 (5.7L) short; AL80 (11L) medium;
  // 15L steel taller; visible variation but bounded so rows stay aligned.
  const heightUnits = Math.min(28, Math.max(14, 12 + waterVolumeLiters * 0.9))
  const bodyWidth = 8
  const neckWidth = 3
  const neckHeight = 2
  const shoulder = 1.5

  // One cylinder, drawn at x=0 with its left edge.
  const cylinderPath = (offsetX: number) => {
    const left = offsetX
    const right = offsetX + bodyWidth
    const neckLeft = offsetX + (bodyWidth - neckWidth) / 2
    const neckRight = offsetX + (bodyWidth + neckWidth) / 2
    return [
      `M ${neckLeft} 0`,
      `L ${neckRight} 0`,
      `L ${neckRight} ${neckHeight}`,
      `L ${right} ${neckHeight + shoulder}`,
      `L ${right} ${heightUnits - shoulder}`,
      `L ${right - shoulder} ${heightUnits}`,
      `L ${left + shoulder} ${heightUnits}`,
      `L ${left} ${heightUnits - shoulder}`,
      `L ${left} ${neckHeight + shoulder}`,
      `L ${neckLeft} ${neckHeight}`,
      "Z",
    ].join(" ")
  }

  const totalWidth = doubled ? bodyWidth * 2 + 2 : bodyWidth
  const paths = doubled
    ? [cylinderPath(0), cylinderPath(bodyWidth + 2)]
    : [cylinderPath(0)]

  return (
    <svg
      viewBox={`-0.5 -0.5 ${totalWidth + 1} ${heightUnits + 1}`}
      style={{ height: "1.6em", width: "auto" }}
      role="img"
      aria-hidden
      className={cn("shrink-0", className)}
      {...props}
    >
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill={MATERIAL_FILL[material]}
          stroke={MATERIAL_STROKE[material]}
          strokeWidth={0.6}
          strokeLinejoin="round"
        />
      ))}
    </svg>
  )
}
