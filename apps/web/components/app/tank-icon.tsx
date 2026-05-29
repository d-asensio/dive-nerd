import * as React from "react"

import {TankMaterial} from "@/utils/tank-library"
import {cn} from "@/lib/utils"

/**
 * Stylised diving cylinder. The outer SVG has a fixed viewBox (one for
 * singles, a wider one for twinsets), so all single-cylinder icons share the
 * same outer footprint and all twin icons share theirs. The *cylinder inside*
 * scales with the water volume — bigger tanks are visibly bigger (both taller
 * AND wider) than smaller tanks. Material drives the fill: light slate for
 * aluminium, dark slate for steel.
 */
const MATERIAL_FILL: Record<TankMaterial, string> = {
  aluminium: "#cbd5e1", // slate-300
  steel:     "#475569", // slate-600
}

const MATERIAL_STROKE: Record<TankMaterial, string> = {
  aluminium: "#94a3b8", // slate-400
  steel:     "#1e293b", // slate-800
}

// Reference cylinder (≈ AL80, 11 L) — sets the "100 %" visual size.
const REF_VOLUME_LITERS = 11
const REF_CYLINDER_WIDTH = 8
const REF_CYLINDER_HEIGHT = 22

// Outer viewBox — one footprint for singles, a wider one for twinsets.
const SINGLE_VIEWBOX = { w: 12, h: 30 }
const DOUBLED_VIEWBOX = { w: 22, h: 30 }

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
  // Cube-root scaling — true to cylinder geometry (V ∝ r²·h with r and h
  // scaling together). Keeps the size range visually controlled (~0.8×–1.2×).
  const scale = Math.cbrt(waterVolumeLiters / REF_VOLUME_LITERS)
  const cylinderWidth = REF_CYLINDER_WIDTH * scale
  const cylinderHeight = REF_CYLINDER_HEIGHT * scale

  const viewBox = doubled ? DOUBLED_VIEWBOX : SINGLE_VIEWBOX

  // Cylinders sit on the same baseline (bottom of the viewBox).
  const baseY = viewBox.h - 1
  const topY = baseY - cylinderHeight

  const drawCylinder = (centerX: number): string => {
    const left = centerX - cylinderWidth / 2
    const right = centerX + cylinderWidth / 2
    const neckWidth = cylinderWidth * 0.4
    const neckHeight = Math.min(2, cylinderHeight * 0.08)
    const shoulder = cylinderWidth * 0.18
    const neckLeft = centerX - neckWidth / 2
    const neckRight = centerX + neckWidth / 2
    return [
      `M ${neckLeft} ${topY}`,
      `L ${neckRight} ${topY}`,
      `L ${neckRight} ${topY + neckHeight}`,
      `L ${right} ${topY + neckHeight + shoulder}`,
      `L ${right} ${baseY - shoulder}`,
      `L ${right - shoulder} ${baseY}`,
      `L ${left + shoulder} ${baseY}`,
      `L ${left} ${baseY - shoulder}`,
      `L ${left} ${topY + neckHeight + shoulder}`,
      `L ${neckLeft} ${topY + neckHeight}`,
      "Z",
    ].join(" ")
  }

  const paths = doubled
    ? [
        drawCylinder(viewBox.w / 2 - cylinderWidth / 2 - 1),
        drawCylinder(viewBox.w / 2 + cylinderWidth / 2 + 1),
      ]
    : [drawCylinder(viewBox.w / 2)]

  return (
    <svg
      viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
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
