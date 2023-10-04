"use client"

import * as React from "react";
import {PointTooltipProps, ResponsiveLine} from '@nivo/line'

import {cn} from "@/lib/utils";
import {Tooltip, TooltipContent, TooltipPortal, TooltipTrigger} from "@/components/ui/tooltip";
import {CompartmentInertGasLoad} from "dive-physics";

const GRAVITY = 9.80665
const surfaceAmbientPressure = 1.0133 // bar
const waterDensity = 1023.6 // kg/m3
const fromBarsToPascals = (bars: number) => bars * 100000

const fromPressureToDepth = ({
 surfaceAmbientPressure: Ps,
 pressure: P,
 waterDensity: Wd
}: {
  surfaceAmbientPressure: number,
  pressure: number,
  waterDensity: number
}) => fromBarsToPascals(P - Ps) / (Wd*GRAVITY)

const PointTooltip = ({ point }: PointTooltipProps) => {
  return (
      <Tooltip open delayDuration={0}>
        <TooltipTrigger/>
        <TooltipPortal>
          <TooltipContent>
            <p className="pointer-events-none">
              <span className="font-bold">Depth:</span> {point.data.yFormatted} m
            </p>
            <p className="pointer-events-none">
              <span className="font-bold">Time:</span> {point.data.xFormatted} min.
            </p>
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
  )
}

interface AdditionalProps {
  dataPoints: {
    compartmentInertGasLoads: CompartmentInertGasLoad[]
    ambientPressure: number
    x: number
    y: number
  }[];
}

export function DiveProfileChart({className, dataPoints, ...props}: React.HTMLAttributes<HTMLDivElement> & AdditionalProps) {
  return (
    <div
      className={cn('min-w-0 min-h-[400px] max-h-[800px] overflow-x-auto', className)}
      {...props}
    >
      <div className="min-w-[600px] h-full">
        <ResponsiveLine
          enablePoints={false}
          data={[
            {
              id: "Dive Profile",
              data: dataPoints
            },
            ...Array.from({ length: 16 }).map((_, i) => ({
              id: `Compartment ${i}`,
              data: dataPoints.map(({compartmentInertGasLoads, x, }) => ({
                x,
                y: fromPressureToDepth({
                  pressure: compartmentInertGasLoads[i].N2 + compartmentInertGasLoads[i].He,
                  surfaceAmbientPressure,
                  waterDensity
                })
              }))
            }))
          ]}
          // colors={["rgb(96, 165, 250)"]}
          margin={{top: 12, right: 18, bottom: 62, left: 62}}
          xScale={{type: "linear"}}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: false,
            reverse: true
          }}
          yFormat=" >-.2f"
          animate={false}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Time (in minutes)",
            legendOffset: 40,
            legendPosition: "middle"
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Depth (in meters)",
            legendOffset: -40,
            legendPosition: "middle"
          }}
          pointSize={5}
          pointBorderWidth={1}
          pointBorderColor={{from: "serieColor"}}
          pointLabelYOffset={-12}
          useMesh
          tooltip={PointTooltip}
          crosshairType="bottom"
        />
      </div>
    </div>
  )
}
