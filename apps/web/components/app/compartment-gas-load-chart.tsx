"use client"

import * as React from "react";
import {ResponsiveLine} from '@nivo/line'

import {buhlmannCompartments} from "dive-physics";

import {
  calculateDiveProfile,
  surfaceAmbientPressure
} from "@/utils/calculate-dive-profile";
import {useSelector} from "@/state/useSelector";
import {diveIntervalsSelector} from "@/state/dive-plan/selectors";
import {useI18n} from "@/locales/client";

const LOAD_COLOR = "rgb(96, 165, 250)" // matches the dive profile line

const colorBySeriesId: Record<string, string> = {
  "Ambient pressure line": "black",
  "Surface pressure line": "lightblue",
  "M-Value line": "red",
  "GF@Low line": "orange",
  "GF@High line": "purple",
  "GF@Ceiling line": "green",
  "Load": LOAD_COLOR,
  "Ceil": "lightblue",
}

const maxValueLineEq = ({ coefficientA: a, coefficientB: b, ambientPressure: Pa }: {
  coefficientA: number,
  coefficientB: number,
  ambientPressure: number
}) => Pa / b + a

const gradientFactorLineEq = ({ ambientPressure: Pa, coefficientA: A, coefficientB: B, gradientFactor: gf }: {
  ambientPressure: number,
  coefficientA: number,
  coefficientB: number,
  gradientFactor: number
}) => A * gf + (1 / B - 1) * gf * Pa + Pa

const gradientFactorsCeilingLineEq = ({ surfaceAmbientPressure: Ps,  ambientPressure: Pa,  compartmentGasPartialPressure: Pcg,  coefficientA: A,  coefficientB: B,  lowGradientFactor: gfL,  highGradientFactor: gfH }: {
  surfaceAmbientPressure: number,
  ambientPressure: number,
  compartmentGasPartialPressure: number,
  coefficientA: number,
  coefficientB: number,
  lowGradientFactor: number,
  highGradientFactor: number
}) => {
  const n = (Pcg - A * gfL) / (gfL / B + 1 - gfL)
  const m = Ps * (gfH / B + 1 - gfH) + A * gfH

  const ceiling = (Pa - Ps) * (Pcg - m) / (n - Ps) + m

  const highGradientFactor = gradientFactorLineEq({
    coefficientA: A,
    coefficientB: B,
    ambientPressure: Pa,
    gradientFactor: gfH
  })

  const lowGradientFactor = gradientFactorLineEq({
    coefficientA: A,
    coefficientB: B,
    ambientPressure: Pa,
    gradientFactor: gfL
  })

  if (ceiling < Pa) return null

  if (ceiling > highGradientFactor) return null
  if (ceiling < lowGradientFactor) return null

  return ceiling
}

export function CompartmentGasLoadChart({ compartmentId,  className,  ...props }: React.HTMLAttributes<HTMLDivElement> & {
  compartmentId: number
}) {
  const t = useI18n()
  const diveIntervals = useSelector(diveIntervalsSelector)
  const gfLow = useSelector(state => state.gradientFactorLow)
  const gfHigh = useSelector(state => state.gradientFactorHigh)
  const hoverTime = useSelector(state => state.hoverTime)

  const intervals = React.useMemo(
    () => calculateDiveProfile(diveIntervals, {
      gfLow,
      gfHigh,
      firstStopAmbientPressure: surfaceAmbientPressure, // placeholder — chart ignores ceiling
    }),
    [diveIntervals, gfLow, gfHigh],
  )

  // While hovering the dive profile, grow the compartment's load/ceiling
  // trajectory only up to the hovered moment; show the whole dive otherwise.
  const visibleIntervals = React.useMemo(
    () => hoverTime == null ? intervals : intervals.filter(sample => sample.x <= hoverTime),
    [intervals, hoverTime],
  )

  const {N2} = buhlmannCompartments[compartmentId]

  const coefficientA = N2.a
  const coefficientB = N2.b

  const lowGradientFactor = 0.3
  const highGradientFactor = 0.8

  const maxAmbientPressure = 5.530439123

  const loadData = visibleIntervals.map(({compartmentInertGasLoads, ambientPressure}) => ({
    x: ambientPressure,
    y: compartmentInertGasLoads[compartmentId].N2 + compartmentInertGasLoads[compartmentId].He,
  }))

  // A blurred under-stroke that makes the (blue) tissue-load line glow a little.
  const LoadGlowLayer = ({ xScale, yScale }: {
    xScale: (value: number) => number
    yScale: (value: number) => number
  }) => {
    if (loadData.length < 2) return null
    const points = loadData.map(p => `${xScale(p.x)},${yScale(p.y)}`).join(' ')
    return (
      <polyline
        points={points}
        fill="none"
        stroke={LOAD_COLOR}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.4}
        style={{ filter: 'blur(3px)' }}
        pointerEvents="none"
      />
    )
  }

  return (
    <div className="w-full min-w-0 h-[260px] overflow-x-auto" {...props}>
      <ResponsiveLine
        enablePoints={false}
        data={[
          {
            id: "Ambient pressure line",
            data: [
              {x: 0, y: 0},
              {x: maxAmbientPressure, y: maxAmbientPressure}
            ]
          },
          {
            id: "Surface pressure line",
            data: [
              {x: surfaceAmbientPressure, y: 0},
              {x: surfaceAmbientPressure, y: maxAmbientPressure}
            ]
          },
          {
            id: "M-Value line",
            data: [
              {
                x: 0,
                y: maxValueLineEq({
                  coefficientA,
                  coefficientB,
                  ambientPressure: 0
                })
              },
              {
                x: maxAmbientPressure,
                y: maxValueLineEq({
                  coefficientA,
                  coefficientB,
                  ambientPressure: maxAmbientPressure
                })
              }
            ]
          },
          {
            id: "GF@Low line",
            data: [
              {
                x: 0,
                y: gradientFactorLineEq({
                  coefficientA,
                  coefficientB,
                  ambientPressure: 0,
                  gradientFactor: lowGradientFactor
                })
              },
              {
                x: maxAmbientPressure,
                y: gradientFactorLineEq({
                  coefficientA,
                  coefficientB,
                  ambientPressure: maxAmbientPressure,
                  gradientFactor: lowGradientFactor
                })
              }
            ]
          },
          {
            id: "GF@High line",
            data: [
              {
                x: 0,
                y: gradientFactorLineEq({
                  coefficientA,
                  coefficientB,
                  ambientPressure: 0,
                  gradientFactor: highGradientFactor
                })
              },
              {
                x: maxAmbientPressure,
                y: gradientFactorLineEq({
                  coefficientA,
                  coefficientB,
                  ambientPressure: maxAmbientPressure,
                  gradientFactor: highGradientFactor
                })
              }

            ]
          },
          {
            id: "GF@Ceiling line",
            data: [
              {
                x: surfaceAmbientPressure,
                y: gradientFactorsCeilingLineEq({
                  ambientPressure: surfaceAmbientPressure,
                  surfaceAmbientPressure,
                  compartmentGasPartialPressure: maxAmbientPressure, /// Wrong
                  coefficientA,
                  coefficientB,
                  highGradientFactor,
                  lowGradientFactor
                })
              },
              {
                x: maxAmbientPressure - surfaceAmbientPressure,
                y: gradientFactorsCeilingLineEq({
                  ambientPressure: maxAmbientPressure - surfaceAmbientPressure,
                  surfaceAmbientPressure,
                  compartmentGasPartialPressure: maxAmbientPressure, /// Wrong
                  coefficientA,
                  coefficientB,
                  highGradientFactor,
                  lowGradientFactor
                })
              }

            ]
          },
          {
            id: "Load",
            data: loadData
          },
          {
            id: "Ceil",
            data: visibleIntervals.map(({
                                   compartmentInertGasLoads,
                                   ambientPressure
                                 }) => ({
              x: ambientPressure,
              y: gradientFactorsCeilingLineEq({
                ambientPressure,
                surfaceAmbientPressure,
                compartmentGasPartialPressure: compartmentInertGasLoads[compartmentId].N2 + compartmentInertGasLoads[compartmentId].He,
                coefficientA,
                coefficientB,
                highGradientFactor,
                lowGradientFactor
              })
            }))
          }
        ]}
        colors={(serie) => colorBySeriesId[String(serie.id)] ?? "gray"}
        margin={{top: 4, right: 6, bottom: 62, left: 62}}
        xScale={{
          type: "linear",
          min: 0,
          max: maxAmbientPressure
        }}
        yScale={{
          type: "linear",
          min: 0,
          max: maxAmbientPressure,
          stacked: false
        }}
        yFormat=" >-.2f"
        animate={false}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          tickValues: [0, 1, 2, 3, 4, 5],
          legend: t('planner.chart.axis.ambient_pressure_bar'),
          legendOffset: 42,
          legendPosition: "start"
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          tickValues: [0, 1, 2, 3, 4, 5],
          legend: t('planner.chart.axis.inert_gas_load_bar'),
          legendOffset: -45,
          legendPosition: "start"
        }}
        pointSize={5}
        pointBorderWidth={1}
        pointBorderColor={{from: "serieColor"}}
        pointLabelYOffset={-12}
        useMesh
        tooltip={() => null}
        enableCrosshair={false}
        layers={['grid', 'markers', 'axes', 'areas', 'crosshair', LoadGlowLayer, 'lines', 'slices', 'points', 'mesh', 'legends']}
      />
    </div>
  )
}
