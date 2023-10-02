"use client"

import * as React from "react";
import {ResponsiveLine} from '@nivo/line'

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

export function CompartmentGasLoadChart({id, className, ...props}: React.HTMLAttributes<HTMLDivElement> & { id: string }) {
  const coefficientA = 0.78
  const coefficientB = 0.55

  const lowGradientFactor = 0.2
  const highGradientFactor = 0.7

  return (
    <div
      className={cn('flex flex-col items-center min-w-0 min-h-[300px] max-h-[600px] overflow-x-auto space-y-2', className)}
      {...props}
    >
      <Badge variant="secondary" className="ml-[62px]">
        Compartment {id}
      </Badge>
      <div className="min-w-[300px] h-full">
        <ResponsiveLine
          enablePoints={false}
          data={[
            {
              id: "Ambient pressure line",
              data: [
                { x: 0, y: 0 },
                { x: 10, y: 10 }
              ]
            },
            {
              id: "Surface pressure line",
              data: [
                { x: 1, y: 0 },
                { x: 1, y: 10 }
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
                  x: 10,
                  y: maxValueLineEq({
                    coefficientA,
                    coefficientB,
                    ambientPressure: 10
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
                  x: 10,
                  y: gradientFactorLineEq({
                    coefficientA,
                    coefficientB,
                    ambientPressure: 10,
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
                  x: 10,
                  y: gradientFactorLineEq({
                    coefficientA,
                    coefficientB,
                    ambientPressure: 10,
                    gradientFactor: highGradientFactor
                  })
                }

              ]
            }
          ]}
          colors={["black", "lightblue", "red", "orange", "purple"]}
          margin={{top: 4, right: 6, bottom: 62, left: 62}}
          xScale={{
            type: "linear",
            min: 0,
            max: 10
          }}
          yScale={{
            type: "linear",
            min: 0,
            max: 10,
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
          tooltip={() => null}
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
