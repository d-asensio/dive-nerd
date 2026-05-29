"use client"

import * as React from "react";
import {ArrowDown, ArrowRight, ArrowUp, Repeat, Timer} from "lucide-react";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {DiveProfileIntervalType, DiveSegment} from "dive-planner";
import {useSelector} from "@/state/useSelector";
import {diveIntervalsSelector} from "@/state/dive-plan/selectors";
import {GasBadge} from "@/components/app/gas-badge";
import {cn} from "@/lib/utils";
import {useI18n} from "@/locales/client";

const iconBySegmentType = {
  [DiveProfileIntervalType.DESCENT]:    <ArrowDown  className="text-blue-500"/>,
  [DiveProfileIntervalType.NAVIGATION]: <ArrowRight className="text-gray-500"/>,
  [DiveProfileIntervalType.ASCENT]:     <ArrowUp    className="text-red-500"/>,
  [DiveProfileIntervalType.DECO_STOP]:  <Timer      className="text-amber-500"/>
}

const useFormatDuration = () => {
  const t = useI18n()
  return React.useCallback((minutes: number): string => {
    if (minutes < 1) return t('planner.units.minutes_dotted_less_than_one')
    return t('planner.units.minutes_dotted', { count: Math.ceil(minutes) })
  }, [t])
}

const formatDepth = (depth: number): string => `${Math.round(depth)} m`

const segmentDuration = ({initialTime, finalTime}: DiveSegment): number =>
  finalTime - initialTime

const GasSwitchRow = ({segment}: {segment: DiveSegment}) => {
  const t = useI18n()
  return (
    <TableRow className="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200">
      <TableCell><Repeat className="text-emerald-600"/></TableCell>
      <TableCell colSpan={2} className="font-medium text-emerald-900 dark:text-emerald-100">
        {t('planner.decompression.switch_gas_at', { depth: Math.round(segment.initialDepth) })}
      </TableCell>
      <TableCell className="text-right">
        <GasBadge gas={segment.gas}/>
      </TableCell>
    </TableRow>
  )
}

export const DecompressionTable = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const t = useI18n()
  const diveIntervals = useSelector(diveIntervalsSelector)
  const hoverTime = useSelector(state => state.hoverTime)
  const formatDuration = useFormatDuration()

  // The segment whose time range contains the time hovered/pinned on the chart.
  const activeIndex = hoverTime === null
    ? -1
    : diveIntervals.findIndex(segment => hoverTime <= segment.finalTime)

  return (
    <div {...props}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0"/>
            <TableHead>{t('planner.levels.depth')}</TableHead>
            <TableHead>{t('planner.levels.duration')}</TableHead>
            <TableHead className="text-right">{t('planner.levels.gas')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {diveIntervals.map((segment, i) => (
            <React.Fragment key={i}>
              {segment.isGasSwitch && <GasSwitchRow segment={segment}/>}
              <TableRow className={cn(i === activeIndex && "bg-muted")}>
                <TableCell>{iconBySegmentType[segment.type]}</TableCell>
                <TableCell className="font-medium">{formatDepth(segment.finalDepth)}</TableCell>
                <TableCell>{formatDuration(segmentDuration(segment))}</TableCell>
                <TableCell className="text-right">
                  <GasBadge gas={segment.gas}/>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
