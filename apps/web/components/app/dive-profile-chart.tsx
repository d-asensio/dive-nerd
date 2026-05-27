"use client"

import * as React from "react";
import {PointTooltipProps, ResponsiveLine} from '@nivo/line'

import {cn} from "@/lib/utils";
import {Tooltip, TooltipContent, TooltipPortal, TooltipTrigger} from "@/components/ui/tooltip";
import {useSelector} from "@/state/useSelector";
import {diveProfileSamplesSelector} from "@/state/dive-plan/selectors";
import {useI18n} from "@/locales/client";

type DiveProfileSeries = {
  id: string
  data: readonly { x: number; y: number }[]
}

const CEILING_STROKE = "#d97706"
const FORBIDDEN_FILL = "#f59e0b"

const PointTooltip = ({ point }: PointTooltipProps<DiveProfileSeries>) => {
  const t = useI18n()
  return (
    <Tooltip open delayDuration={0}>
      <TooltipTrigger asChild>
        <div className="w-0 h-0" />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent asChild>
          <div className='pointer-events-none'>
            <p>
              <span className="font-bold">{t('planner.chart.tooltip.depth')}:</span> {point.data.yFormatted} m
            </p>
            <p>
              <span className="font-bold">{t('planner.chart.tooltip.time')}:</span> {point.data.xFormatted} min.
            </p>
          </div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}

export function DiveProfileChart({className, ...props}: React.HTMLAttributes<HTMLDivElement>) {
  const t = useI18n()
  const samples = useSelector(diveProfileSamplesSelector)
  const showCeiling = useSelector(state => state.showCeiling)

  const profileData = React.useMemo(
    () => samples.map(s => ({ x: s.x, y: s.depth })),
    [samples],
  )

  const ceilingData = React.useMemo(
    () => samples.map(s => ({ x: s.x, y: s.ceilingDepth })),
    [samples],
  )

  const CeilingLayer = React.useCallback(
    ({ xScale, yScale }: { xScale: (v: number) => number; yScale: (v: number) => number }) => {
      if (!showCeiling || ceilingData.length < 2) return null

      const x = xScale
      const y = yScale

      const path = ceilingData.map(p => `${x(p.x)},${y(p.y)}`)
      const surfaceY = y(0)
      const forbidden = [
        `${x(ceilingData[0].x)},${surfaceY}`,
        ...path,
        `${x(ceilingData[ceilingData.length - 1].x)},${surfaceY}`,
      ].join(' ')

      return (
        <g pointerEvents="none">
          <polygon points={forbidden} fill={FORBIDDEN_FILL} fillOpacity={0.12} />
          <polyline
            points={path.join(' ')}
            fill="none"
            stroke={CEILING_STROKE}
            strokeWidth={1.8}
            strokeDasharray="5,3"
          />
        </g>
      )
    },
    [ceilingData, showCeiling],
  )

  return (
    <div
      className={cn('min-w-0 min-h-[400px] max-h-[800px] overflow-x-auto', className)}
      {...props}
    >
      <div className="min-w-[600px] h-full">
        <ResponsiveLine
          enablePoints={false}
          data={[{ id: "Dive Profile", data: profileData }]}
          colors={["rgb(96, 165, 250)"]}
          margin={{top: 12, right: 18, bottom: 62, left: 62}}
          xScale={{type: "linear"}}
          yScale={{
            type: "linear",
            min: 0,
            max: "auto",
            stacked: false,
            reverse: true,
          }}
          yFormat=" >-.2f"
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: t('planner.chart.axis.time_minutes'),
            legendOffset: 40,
            legendPosition: "start",
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: t('planner.chart.axis.depth_meters'),
            legendOffset: -40,
            legendPosition: "start",
          }}
          pointSize={5}
          pointBorderWidth={1}
          pointBorderColor={{from: "serieColor"}}
          pointLabelYOffset={-12}
          useMesh
          tooltip={PointTooltip}
          crosshairType="bottom"
          layers={[
            "grid",
            "markers",
            "axes",
            CeilingLayer,
            "lines",
            "slices",
            "points",
            "mesh",
            "legends",
          ]}
        />
      </div>
    </div>
  )
}
