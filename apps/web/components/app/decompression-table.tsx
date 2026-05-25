"use client"

import * as React from "react";
import {ArrowDown, ArrowRight, ArrowUp, Repeat, Timer} from "lucide-react";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {DiveProfileIntervalType, DiveSegment} from "dive-planner";
import {useSelector} from "@/state/useSelector";
import {diveIntervalsSelector} from "@/state/dive-plan/selectors";
import {GasBadge} from "@/components/app/gas-badge";

const iconBySegmentType = {
  [DiveProfileIntervalType.DESCENT]:    <ArrowDown  className="text-blue-500"/>,
  [DiveProfileIntervalType.NAVIGATION]: <ArrowRight className="text-gray-500"/>,
  [DiveProfileIntervalType.ASCENT]:     <ArrowUp    className="text-red-500"/>,
  [DiveProfileIntervalType.DECO_STOP]:  <Timer      className="text-amber-500"/>
}

const formatDuration = (minutes: number): string => {
  if (minutes < 1) return `< 1 min.`
  return `${Math.ceil(minutes)} min.`
}

const formatDepth = (depth: number): string => `${Math.round(depth)} m`

const segmentDuration = ({initialTime, finalTime}: DiveSegment): number =>
  finalTime - initialTime

const GasSwitchRow = ({segment}: {segment: DiveSegment}) => (
  <TableRow className="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200">
    <TableCell><Repeat className="text-emerald-600"/></TableCell>
    <TableCell colSpan={2} className="font-medium text-emerald-900 dark:text-emerald-100">
      Switch gas at {formatDepth(segment.initialDepth)}
    </TableCell>
    <TableCell className="text-right">
      <GasBadge gas={segment.gas}/>
    </TableCell>
  </TableRow>
)

export const DecompressionTable = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const diveIntervals = useSelector(diveIntervalsSelector)

  return (
    <div {...props}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0"/>
            <TableHead>Depth</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead className="text-right">Gas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {diveIntervals.map((segment, i) => (
            <React.Fragment key={i}>
              {segment.isGasSwitch && <GasSwitchRow segment={segment}/>}
              <TableRow>
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
