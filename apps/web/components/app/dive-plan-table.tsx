"use client"

import * as React from "react";
import {ChangeEvent} from "react";
import {AlertTriangle, Minus, Plus} from "lucide-react";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

import {InputWithUnits} from "@/components/app/input-with-units";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useStore} from "@/state/store";


import {diveLevelByIdSelector, isFirstDiveLevelSelector} from "@/state/dive-plan/selectors";
import {Separator} from "@/components/ui/separator";
import {useSelector} from "@/state/useSelector";
import {GasMixSelector} from "@/components/app/gas-mix-selector";
import {mixMODSelector} from "@/state/dive-gases/selectors";

interface PlanLevelRow {
  id: string;
}

const PlanLevelRow = React.memo(function PlanLevelRow({ id }: PlanLevelRow) {
  const isFirst = useSelector(isFirstDiveLevelSelector, id)
  const { depth, duration, gasMixId } = useSelector(diveLevelByIdSelector, id)
  const gasMOD = useSelector(mixMODSelector, gasMixId)

  const removeDiveLevel = useStore.use.removeDiveLevel()
  const updateDiveLevel = useStore.use.updateDiveLevel()

  const alert = gasMOD < depth
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

  const handleGasMixChange = React.useCallback((gasMixId: string) => {
    updateDiveLevel(id, { gasMixId })
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
        <GasMixSelector
          value={gasMixId}
          onValueChange={handleGasMixChange}
        />
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

const DivePlanTableBody = () => {
  const diveLevelsIdList = useStore.use.diveLevelsIdList()

  return (
    <TableBody>
      {diveLevelsIdList.map(
        levelId => (
          <PlanLevelRow
            key={levelId}
            id={levelId}
          />
        )
      )}
    </TableBody>
  )
}

export const DivePlanTable = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const addDiveLevel = useStore.use.addDiveLevel()

  const onAddLevelButtonClick = React.useCallback(() => {
    addDiveLevel({
      depth: 30,
      duration: 20
    })
  }, [addDiveLevel])

  return (
    <div {...props}>
      <Table>
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
        <DivePlanTableBody />
      </Table>
      <Separator />
      <div className="text-right w-full p-4">
        <Button variant="ghost" onClick={onAddLevelButtonClick}>
          <Plus className="mr-2 h-4 w-4"/>
          Add level
        </Button>
      </div>
    </div>
  )
}
