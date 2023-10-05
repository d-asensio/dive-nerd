"use client"

import * as React from "react";
import {AlertTriangle, Minus, Plus} from "lucide-react";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Badge} from "@/components/ui/badge";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

import {InputWithUnits} from "@/components/app/input-with-units";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useStore} from "@/state/store";


import {diveLevelByIdSelector, diveLevelIdsSelector} from "@/state/dive-plan/selectors";

interface PlanLevelRow {
  id: number;
}

function PlanLevelRow({ id }: PlanLevelRow) {
  const { depth, duration } = useStore(diveLevelByIdSelector(id))

  const isFirst = id === 0
  const alert = isFirst
    ? {
      id: 'GAS_MOD_LOWER_THAN_DEPTH',
      message: (
        <>
          The maximum operating depth for the selected gas
          is <span className="font-bold">21 meters</span>.
        </>
      )
    }
    : null

  return (
    <TableRow className={cn(alert && "bg-red-100 hover:bg-red-100/50")}>
      <TableCell className='flex items-center space-x-4'>
        {alert && (
          <Tooltip delayDuration={0}>
            <TooltipTrigger>
              <AlertTriangle className="h-4 w-4 text-red-500"/>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-[300px] text-red-500">
                {alert.message}
              </p>
            </TooltipContent>
          </Tooltip>
        )}
        <InputWithUnits
          units="m"
          type="number"
          defaultValue={depth}
        />
      </TableCell>
      <TableCell>
        <InputWithUnits
          units="min."
          type="number"
          defaultValue={duration}
        />
      </TableCell>
      <TableCell>
        <Select defaultValue="nitrox-50">
          <SelectTrigger>
            <SelectValue placeholder="-- no gas selected --"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="helitrox-21/22">
              <Badge className="bg-indigo-400 hover:bg-indigo-400/80 select-none whitespace-nowrap">
                Helitrox 21/22
              </Badge>
            </SelectItem>
            <SelectItem value="nitrox-50">
              <Badge className="bg-orange-400 hover:bg-orange-400/80 select-none whitespace-nowrap">
                Nitrox 50
              </Badge>
            </SelectItem>
            <SelectItem value="oxygen-100">
              <Badge className="bg-green-400 hover:bg-green-400/80 select-none whitespace-nowrap">
                Oxygen 100
              </Badge>
            </SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="outline" disabled={isFirst}>
              <Minus className="h-4 w-4"/>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isFirst
              ? 'First depth level can not be removed'
              : 'Remove depth level'}
          </TooltipContent>
        </Tooltip>
      </TableCell>
    </TableRow>
  )
}

export const DivePlanTable = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const diveLevelIds = useStore(diveLevelIdsSelector)

  return (
    <Table {...props}>
      <TableHeader>
        <TableRow>
          <TableHead>
            Depth
          </TableHead>
          <TableHead>
            Duration
          </TableHead>
          <TableHead className="w-[200px]">
            Gas
          </TableHead>
          <TableHead className="w-0"/>
        </TableRow>
      </TableHeader>
      <TableBody>
        {diveLevelIds.map(
          diveLevelId => (
            <PlanLevelRow
              key={diveLevelId}
              id={diveLevelId}
            />
          )
        )}
        <TableRow className="hover:bg-background">
          <TableCell colSpan={5} className="text-right">
            <Button variant="ghost">
              <Plus className="mr-2 h-4 w-4"/>
              Add level
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
