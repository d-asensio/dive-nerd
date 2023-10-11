"use client"

import * as React from "react";
import {ArrowDown, ArrowRight, ArrowUp} from "lucide-react";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {DiveProfileIntervalType} from "dive-profile-generator";
import {useSelector} from "@/state/useSelector";
import {diveIntervalsSelector} from "@/state/dive-plan/selectors";
import {GasBadge} from "@/components/app/gas-badge";

export const DecompressionTable = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const diveIntervals = useSelector(diveIntervalsSelector)

  return (
    <div {...props}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0"/>
            <TableHead>
              Depth
            </TableHead>
            <TableHead>
              Duration
            </TableHead>
            <TableHead className="text-right">
              Gas
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {diveIntervals.map(({ type, endDepth, endTime, startTime, gas}, i) => (
            <React.Fragment key={i}>
              {type === DiveProfileIntervalType.ASCENT && endDepth === 21 && (
                <TableRow className="font-medium bg-muted/50">
                  <TableCell colSpan={3}>
                    Deco stops from 21 m
                  </TableCell>
                  <TableCell className="text-right">
                    7 min.
                  </TableCell>
                </TableRow>
              )}
              {type === DiveProfileIntervalType.ASCENT && endDepth === 6 && (
                <TableRow className="font-medium bg-muted/50">
                  <TableCell colSpan={3}>
                    Deco stops from 6 m
                  </TableCell>
                  <TableCell className="text-right">
                    7 min.
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell>
                  {type === DiveProfileIntervalType.DESCENT && <ArrowDown className="text-blue-500"/>}
                  {type === DiveProfileIntervalType.NAVIGATION && <ArrowRight className="text-gray-500"/>}
                  {type === DiveProfileIntervalType.ASCENT && <ArrowUp className="text-red-500"/>}
                </TableCell>
                <TableCell className="font-medium">
                  {endDepth} m
                </TableCell>
                <TableCell>
                  {Math.ceil(endTime - startTime)} min.
                </TableCell>
                <TableCell className="text-right">
                  <GasBadge gas={gas} />
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
