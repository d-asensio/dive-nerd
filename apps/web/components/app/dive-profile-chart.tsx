"use client"

import * as React from "react";
import {PointTooltipProps, ResponsiveLine} from '@nivo/line'

import {cn} from "@/lib/utils";
import {Tooltip, TooltipContent, TooltipPortal, TooltipTrigger} from "@/components/ui/tooltip";

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

export function DiveProfileChart({className, dataPoints, ...props}: React.HTMLAttributes<HTMLDivElement> & { dataPoints: { x: number, y: number }[] }) {
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
            }
          ]}
          colors={["rgb(96, 165, 250)"]}
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
