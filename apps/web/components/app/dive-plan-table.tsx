"use client"

import * as React from "react";
import {AlertTriangle, Minus, Plus} from "lucide-react";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

import {InputWithUnits} from "@/components/app/input-with-units";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useSelector, useStore} from "@/state/store";


import {diveLevelByIdSelector, isFirstDiveLevelSelector} from "@/state/dive-plan/selectors";
import {GasBadge} from "@/components/app/gas-badge";
import {ChangeEvent} from "react";

interface PlanLevelRow {
  id: string;
}

const PlanLevelRow = React.memo(({ id }: PlanLevelRow) => {
  const isFirst = useSelector( isFirstDiveLevelSelector, id)
  const { depth, duration, gasMix } = useSelector(diveLevelByIdSelector, id)

  const removeDiveLevel = useStore.use.removeDiveLevel()
  const updateDiveLevel = useStore.use.updateDiveLevel()

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

  const handleDepthChange = React.useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const depth = parseInt(e.target.value, 10)

    updateDiveLevel(id, { depth })
  }, [id, updateDiveLevel])

  const handleDurationChange = React.useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const duration = parseInt(e.target.value, 10)

    updateDiveLevel(id, { duration })
  }, [id, updateDiveLevel])

  const handleRemoveButtonClick = React.useCallback(() => {
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
          value={depth}
          onChange={handleDepthChange}
          min={0}
          step={1}
        />
      </TableCell>
      <TableCell>
        <InputWithUnits
          units="min."
          type="number"
          value={duration}
          onChange={handleDurationChange}
          min={0}
          step={1}
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
              onClick={handleRemoveButtonClick}
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
})

export const DivePlanTable = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const addDiveLevel = useStore.use.addDiveLevel()
  const diveLevelsIdList = useStore.use.diveLevelsIdList()

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
        {diveLevelsIdList.map(
          levelId => (
            <PlanLevelRow
              key={levelId}
              id={levelId}
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
