"use client"

import * as React from "react";
import {ResponsiveLine} from '@nivo/line'

import {buhlmannCompartments, CompartmentInertGasLoad} from "dive-physics";

import {cn} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";

const maxValueLineEq = ({
  coefficientA: a,
  coefficientB: b,
  ambientPressure: Pa
}: {
  coefficientA: number,
  coefficientB: number,
  ambientPressure: number
}) => Pa/b + a

const gradientFactorLineEq = ({
  ambientPressure: Pa,
  coefficientA: A,
  coefficientB: B,
  gradientFactor: gf
}: {
  ambientPressure: number,
  coefficientA: number,
  coefficientB: number,
  gradientFactor: number
}) => A*gf + (1/B - 1)*gf*Pa + Pa

const gradientFactorsCeilingLineEq = ({
  surfaceAmbientPressure: Ps,
  ambientPressure: Pa,
  compartmentGasPartialPressure: Pcg,
  coefficientA: A,
  coefficientB: B,
  lowGradientFactor: gfL,
  highGradientFactor: gfH
}: {
  surfaceAmbientPressure: number,
  ambientPressure: number,
  compartmentGasPartialPressure: number,
  coefficientA: number,
  coefficientB: number,
  lowGradientFactor: number,
  highGradientFactor: number
}) => {
  const n = (Pcg - A*gfL)/(gfL/B + 1 - gfL)
  const m = Ps*(gfH/B + 1 - gfH) + A*gfH

  const ceiling = (Pa - Ps)*(Pcg - m)/(n - Ps) + m

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

interface Dive {
  cumulativeCompartmentInertGasLoad: CompartmentInertGasLoad[]
  dataPoints: {
    compartmentInertGasLoads: CompartmentInertGasLoad[]
    ambientPressure: number
    x: number
    y: number
  }[];
}

export function CompartmentGasLoadChart({compartmentId, className, dive, surfaceAmbientPressure, ...props}: React.HTMLAttributes<HTMLDivElement> & { compartmentId: number, dive: Dive, surfaceAmbientPressure: number }) {
  const { N2 } = buhlmannCompartments[compartmentId]

  const coefficientA = N2.a
  const coefficientB = N2.b

  const lowGradientFactor = 0.3
  const highGradientFactor = 0.8

  const maxAmbientPressure = 5.530439123

  return (
    <div
      className={cn('flex flex-col items-center min-w-0 h-[600px] overflow-x-auto space-y-2', className)}
      {...props}
    >
      <Badge variant="secondary" className="ml-[62px]">
        Compartment {compartmentId + 1}
      </Badge>
      <div className="w-full h-full">
        <ResponsiveLine
          enablePoints={false}
          data={[
            {
              id: "Ambient pressure line",
              data: [
                { x: 0, y: 0 },
                { x: maxAmbientPressure, y: maxAmbientPressure }
              ]
            },
            {
              id: "Surface pressure line",
              data: [
                { x: surfaceAmbientPressure, y: 0 },
                { x: surfaceAmbientPressure, y: maxAmbientPressure }
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
              data: dive.dataPoints.map(({ compartmentInertGasLoads, ambientPressure }) => ({
                x: ambientPressure,
                y: compartmentInertGasLoads[compartmentId].N2 + compartmentInertGasLoads[compartmentId].He
              }))
            },
            {
              id: "Ceil",
              data: dive.dataPoints.map(({ compartmentInertGasLoads, ambientPressure }) => ({
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
          colors={[
            "black",
            "lightblue",
            "red",
            "orange",
            "purple",
            "green"
          ]}
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
            legend: "Ambient pressure (in bar)",
            legendOffset: 30,
            legendPosition: "start"
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Inert gas load (in bar)",
            legendOffset: -30,
            legendPosition: "start"
          }}
          pointSize={5}
          pointBorderWidth={1}
          pointBorderColor={{from: "serieColor"}}
          pointLabelYOffset={-12}
          useMesh
          crosshairType="bottom"
        />
      </div>
    </div>
  )
}
