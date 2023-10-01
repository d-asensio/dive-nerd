"use client"

import * as React from "react";
import {ResponsiveLine} from '@nivo/line'

import {cn} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";

export function CompartmentGasLoadChart({id, className, ...props}: React.HTMLAttributes<HTMLDivElement> & { id: string }) {
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
              id: "Dive Profile",
              data: [
                { x: 0, y: 0 },
                { x: 10, y: 10 }
              ]
            },
            {
              id: "Ambient pressure line",
              data: [
                { x: 1, y: 0 },
                { x: 1, y: 10 }
              ]
            }
          ]}
          colors={["black", "red"]}
          margin={{top: 4, right: 0, bottom: 62, left: 62}}
          xScale={{type: "linear"}}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
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
