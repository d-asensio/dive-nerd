"use client"

import * as React from "react";
import {ResponsiveLine} from '@nivo/line'
import {Clock} from "lucide-react";

import {cn} from "@/lib/utils";
import {useSelector} from "@/state/useSelector";
import {diveProfileSamplesSelector, diveIntervalsSelector} from "@/state/dive-plan/selectors";
import {depthAtTime} from "@/utils/interpolate-depth-at-time";
import {gasAtTime} from "@/utils/gas-at-time";
import {GasBadge} from "@/components/app/gas-badge";
import {useI18n} from "@/locales/client";

const CEILING_STROKE = "#d97706"
const FORBIDDEN_FILL = "#f59e0b"
const SERIES_COLOR = "rgb(96, 165, 250)"
const GUIDE_STROKE = "#94a3b8"

const MARGIN = {top: 12, right: 18, bottom: 62, left: 62}

interface LinearScale {
  (value: number): number
  invert: (pixel: number) => number
}

interface Cursor {
  x: number      // pixel, inner plot coordinates
  y: number      // pixel, inner plot coordinates
  time: number   // minutes — the cursor's time (xScale.invert), used to project onto the lines
  flipX: boolean // render the tooltip to the left of the cursor (near the right edge)
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

export function DiveProfileChart({className, ...props}: React.HTMLAttributes<HTMLDivElement>) {
  const t = useI18n()
  const samples = useSelector(diveProfileSamplesSelector)
  const intervals = useSelector(diveIntervalsSelector)
  const showCeiling = useSelector(state => state.showCeiling)
  // `hover` tracks the live mouse position; `pinned` is fixed on click and
  // takes precedence so the tooltip stays put anywhere along that vertical.
  const [hover, setHover] = React.useState<Cursor | null>(null)
  const [pinned, setPinned] = React.useState<Cursor | null>(null)
  const cursor = pinned ?? hover

  // A pin is anchored in pixel space, so drop it when the profile (and its
  // scales) change to avoid stranding it off the line.
  React.useEffect(() => setPinned(null), [samples])

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

  // Captures the cursor over the plot area and projects it onto the profile:
  // the tooltip reports the exact time/depth under the cursor, while the dot
  // marks the diver's actual depth at the cursor's time (vertical projection).
  const CursorLayer = React.useCallback(
    ({ innerWidth, innerHeight, xScale, yScale }: {
      innerWidth: number
      innerHeight: number
      // nivo types these as plain scale functions, but at runtime they are d3
      // linear scales that also expose `invert` (used to map pixels → data).
      xScale: (value: number) => number
      yScale: (value: number) => number
    }) => {
      const xLinear = xScale as LinearScale

      const cursorFromEvent = (event: React.MouseEvent<SVGRectElement>): Cursor => {
        const bounds = event.currentTarget.getBoundingClientRect()
        const localX = clamp(event.clientX - bounds.left, 0, innerWidth)
        const localY = clamp(event.clientY - bounds.top, 0, innerHeight)
        return {
          x: localX,
          y: localY,
          time: xLinear.invert(localX),
          flipX: localX > innerWidth / 2,
        }
      }

      const onMouseMove = (event: React.MouseEvent<SVGRectElement>) => setHover(cursorFromEvent(event))
      const onMouseLeave = () => setHover(null)
      // Click toggles a pin: fix the tooltip to that vertical, or release it.
      // Read the event synchronously — `currentTarget` is nulled out by the
      // time the functional updater runs during reconciliation.
      const onClick = (event: React.MouseEvent<SVGRectElement>) => {
        const next = cursorFromEvent(event)
        setPinned(prev => (prev ? null : next))
      }

      const profileDepthY = cursor ? yScale(depthAtTime(profileData, cursor.time)) : 0
      const showCeilingDot = cursor && showCeiling && ceilingData.length >= 2
      const ceilingDepthY = showCeilingDot ? yScale(depthAtTime(ceilingData, cursor.time)) : 0

      return (
        <g>
          {cursor && (
            <>
              <line
                x1={cursor.x}
                x2={cursor.x}
                y1={0}
                y2={innerHeight}
                stroke={GUIDE_STROKE}
                strokeWidth={pinned ? 1.5 : 1}
                strokeDasharray={pinned ? undefined : "4,3"}
                pointerEvents="none"
              />
              {showCeilingDot && (
                <circle
                  cx={cursor.x}
                  cy={ceilingDepthY}
                  r={4}
                  fill={CEILING_STROKE}
                  stroke="#fff"
                  strokeWidth={1.5}
                  pointerEvents="none"
                />
              )}
              <circle
                cx={cursor.x}
                cy={profileDepthY}
                r={4}
                fill={SERIES_COLOR}
                stroke="#fff"
                strokeWidth={1.5}
                pointerEvents="none"
              />
            </>
          )}
          <rect
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            pointerEvents="all"
            style={{ cursor: 'crosshair' }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
          />
        </g>
      )
    },
    [cursor, pinned, profileData, ceilingData, showCeiling],
  )

  return (
    <div
      className={cn('min-w-0 min-h-[400px] max-h-[800px] overflow-x-auto', className)}
      {...props}
    >
      <div className="relative min-w-[600px] h-full">
        <ResponsiveLine
          enablePoints={false}
          data={[{ id: "Dive Profile", data: profileData }]}
          colors={[SERIES_COLOR]}
          margin={MARGIN}
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
          isInteractive={false}
          layers={[
            "grid",
            "markers",
            "axes",
            CeilingLayer,
            "lines",
            CursorLayer,
          ]}
        />
        {cursor && (() => {
          const profileDepth = depthAtTime(profileData, cursor.time)
          const ceiling = depthAtTime(ceilingData, cursor.time)
          const gas = gasAtTime(intervals, cursor.time)

          return (
            <div
              className="pointer-events-none absolute z-50 w-max overflow-hidden whitespace-nowrap rounded-md border bg-popover text-xs text-popover-foreground shadow-md"
              style={{
                left: MARGIN.left + cursor.x,
                top: MARGIN.top + cursor.y,
                transform: `translate(${cursor.flipX ? 'calc(-100% - 12px)' : '12px'}, -50%)`,
              }}
            >
              <div className="flex items-center gap-1.5 border-b bg-muted/50 px-3 py-1.5 font-medium">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                {cursor.time.toFixed(1)} min
              </div>
              <div className="grid grid-cols-[auto_auto] items-center gap-x-6 gap-y-1 px-3 py-2">
                <span className="text-muted-foreground">{t('planner.chart.tooltip.profile_depth')}</span>
                <span className="text-right font-medium tabular-nums">{profileDepth.toFixed(1)} m</span>
                {showCeiling && (
                  <>
                    <span className="flex items-center gap-1.5 font-medium text-amber-600">
                      <span className="inline-block h-0.5 w-3 border-t-2 border-dashed border-amber-600" />
                      {t('planner.chart.tooltip.ceiling')}
                    </span>
                    <span className="text-right font-semibold tabular-nums text-amber-600">
                      {ceiling.toFixed(1)} m
                    </span>
                  </>
                )}
                {gas && (
                  <span className="col-span-2 justify-self-end pt-1">
                    <GasBadge gas={gas} />
                  </span>
                )}
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
