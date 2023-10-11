"use client"

import * as React from "react";
import {PointTooltipProps, ResponsiveLine} from '@nivo/line'

import {cn} from "@/lib/utils";
import {Tooltip, TooltipContent, TooltipPortal, TooltipTrigger} from "@/components/ui/tooltip";
import {useSelector} from "@/state/useSelector";
import {diveIntervalsSelector} from "@/state/dive-plan/selectors";
import {calculateDiveProfile} from "@/utils/calculate-dive-profile";

export function CompartmentsProfileChart({className, ...props}: React.HTMLAttributes<HTMLDivElement>) {
  const diveIntervals = useSelector(diveIntervalsSelector)
  const intervals = calculateDiveProfile(diveIntervals)

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
              data: intervals
            },
            ...Array.from({ length: 16 }).map((_, i) => ({
              id: `Compartment ${i}`,
              data: intervals.map(({compartmentInertGasLoads, x, }) => ({
                x,
                y: compartmentInertGasLoads[i].N2 + compartmentInertGasLoads[i].He
              }))
            }))
          ]}
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
          tooltip={() => null}
          crosshairType="bottom"
        />
      </div>
    </div>
  )
}
