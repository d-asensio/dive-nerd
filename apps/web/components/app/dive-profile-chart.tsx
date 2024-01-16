"use client"

import * as React from "react";
import {PointTooltipProps, ResponsiveLine} from '@nivo/line'

import {cn} from "@/lib/utils";
import {Tooltip, TooltipContent, TooltipPortal, TooltipTrigger} from "@/components/ui/tooltip";
import {useSelector} from "@/state/useSelector";
import {diveIntervalsSelector} from "@/state/dive-plan/selectors";

const PointTooltip = ({ point }: PointTooltipProps) => {
  return (
      <Tooltip open delayDuration={0}>
        <TooltipTrigger asChild>
          <div className="w-0 h-0" />
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent asChild>
            <div className='pointer-events-none'>
              <p>
                <span className="font-bold">Depth:</span> {point.data.yFormatted} m
              </p>
              <p>
                <span className="font-bold">Time:</span> {point.data.xFormatted} min.
              </p>
            </div>
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
  )
}

export function DiveProfileChart({className, ...props}: React.HTMLAttributes<HTMLDivElement>) {
  const diveIntervals = useSelector(diveIntervalsSelector)

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
              data: [
                {
                  x: 0,
                  y: 0
                },
              ...diveIntervals.map(({ finalTime, finalDepth }) => ({
                  x: finalTime,
                  y: finalDepth
                }))
              ]
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
          motionConfig={{
            mass: 2,
            tension: 200,
            friction: 26,
            clamp: true,
            precision: 0.01,
            velocity: 0
          }}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Time (in minutes)",
            legendOffset: 40,
            legendPosition: "start"
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Depth (in meters)",
            legendOffset: -40,
            legendPosition: "start"
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
