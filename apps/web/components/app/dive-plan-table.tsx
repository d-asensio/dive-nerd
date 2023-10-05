"use client"

import * as React from "react";
import {AlertTriangle, Minus, Plus} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

import {InputWithUnits} from "@/components/app/input-with-units";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useStore} from "@/state/store";


import {
  diveLevelByIdSelector,
  diveLevelIdsSelector
} from "@/state/dive-plan/selectors";
import {GasBadge} from "@/components/app/gas-badge";

interface PlanLevelRow {
  id: number;
}

function PlanLevelRow({ id }: PlanLevelRow) {
  const {
    diveLevel: { depth, duration, gasMix },
    removeDiveLevel
  } = useStore(state => ({
    diveLevel: diveLevelByIdSelector(id)(state),
    removeDiveLevel: state.removeDiveLevel
  }))

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

  const onRemoveButtonClick = React.useCallback(() => {
    removeDiveLevel(id)
  }, [id, removeDiveLevel])

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
        <Select defaultValue="0">
          <SelectTrigger>
            <SelectValue placeholder="-- no gas selected --"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">
              <GasBadge gasMix={gasMix} />
            </SelectItem>
            <SelectItem value="1">
              <GasBadge gasMix={{ fO2: .21, fHe: 0 }} />
            </SelectItem>
            <SelectItem value="2">
              <GasBadge gasMix={{ fO2: .50, fHe: 0 }} />
            </SelectItem>
            <SelectItem value="3">
              <GasBadge gasMix={{ fO2: .93, fHe: 0 }} />
            </SelectItem>
            <SelectItem value="4">
              <GasBadge gasMix={{ fO2: .21, fHe: .1 }} />
            </SelectItem>
            <SelectItem value="5">
              <GasBadge gasMix={{ fO2: .18, fHe: .1 }} />
            </SelectItem>
            <SelectItem value="6">
              <GasBadge gasMix={{ fO2: .20, fHe: .80 }} />
            </SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              disabled={isFirst}
              onClick={onRemoveButtonClick}
            >
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
  const { diveLevelIds, addDiveLevel } = useStore(state => ({
    diveLevelIds: diveLevelIdsSelector(state),
    addDiveLevel: state.addDiveLevel
  }))

  const onAddLevelButtonClick = React.useCallback(() => {
    addDiveLevel({
      depth: 30,
      duration: 20,
      gasMix: { fO2: 0.21, fHe: 0 }
    })
  }, [addDiveLevel])

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
            <Button variant="ghost" onClick={onAddLevelButtonClick}>
              <Plus className="mr-2 h-4 w-4"/>
              Add level
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
