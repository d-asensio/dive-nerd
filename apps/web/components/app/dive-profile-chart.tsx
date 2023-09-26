"use client"

import * as React from "react";
import { ResponsiveLine } from '@nivo/line'
import {cn} from "@/lib/utils";

export function DiveProfileChart({className, ...props}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('min-w-0 min-h-[400px] max-h-[700px] overflow-x-scroll', className)}
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
                  "x": 0,
                  "y": 0
                },
                {
                  "x": 5,
                  "y": 50
                },
                {
                  "x": 35,
                  "y": 50
                },
                {
                  "x": 40,
                  "y": 40
                },
                {
                  "x": 45,
                  "y": 40
                },
                {
                  "x": 50,
                  "y": 30
                }
              ]
            }
          ]}
          colors={["rgb(96, 165, 250)"]}
          margin={{top: 24, right: 18, bottom: 62, left: 62}}
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
          crosshairType="bottom"
        />
      </div>
    </div>
  )
}