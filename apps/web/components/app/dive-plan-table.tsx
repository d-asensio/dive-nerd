"use client"

import * as React from "react";
import {ChangeEvent} from "react";
import {AlertTriangle, Minus, Plus} from "lucide-react";
import {NIL, v1 as uuid} from "uuid";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

import {InputWithUnits} from "@/components/app/input-with-units";
import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {cn} from "@/lib/utils";
import {useStore} from "@/state/store";


import {diveLevelByIdSelector, isFirstDiveLevelSelector} from "@/state/dive-plan/selectors";
import {Separator} from "@/components/ui/separator";
import {useSelector} from "@/state/useSelector";
import {BottomGasSelector} from "@/components/app/bottom-gas-selector";
import {gasMODSelector} from "@/state/dive-gases/selectors";
import {useI18n} from "@/locales/client";

interface PlanLevelRow {
  id: string;
}

const PlanLevelRow = React.memo(function PlanLevelRow({ id }: PlanLevelRow) {
  const t = useI18n()
  const isFirst = useSelector(isFirstDiveLevelSelector, id)
  const { depth, duration, gasId } = useSelector(diveLevelByIdSelector, id)
  const gasMOD = useSelector(gasMODSelector, gasId)

  const removeDiveLevel = useStore.use.removeDiveLevel()
  const updateDiveLevel = useStore.use.updateDiveLevel()

  const alert = gasMOD < depth
    ? {
      id: 'GAS_MOD_LOWER_THAN_DEPTH',
      message: (
        <>
          {t('planner.levels.gas_mod_warning_prefix')}{' '}
          <span className="font-bold">{gasMOD} {t('planner.levels.gas_mod_warning_suffix')}</span>.
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

  const handleGasChange = React.useCallback((gasId: string) => {
    updateDiveLevel(id, { gasId })
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
            <TooltipContent align="start">
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
          className="max-w-[150px] min-w-[120px]"
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
          className="max-w-[150px] min-w-[120px]"
        />
      </TableCell>
      <TableCell />
      <TableCell>
        <BottomGasSelector
          value={gasId}
          onValueChange={handleGasChange}
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
              ? t('planner.levels.first_remove_disabled')
              : t('planner.levels.remove_tooltip')}
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

const DEPTH_INCREMENTS_METERS = [5, 10, 20]

export const DivePlanTable = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const t = useI18n()
  const addDiveLevel = useStore.use.addDiveLevel()

  // Add a level deeper than the current last one by the chosen increment.
  const addDeeperLevel = React.useCallback((deltaMeters: number) => {
    const {diveLevelsIdList, diveLevelsMap} = useStore.getState()
    const lastLevelId = diveLevelsIdList[diveLevelsIdList.length - 1]
    const lastDepth = lastLevelId ? diveLevelsMap[lastLevelId].depth : 0

    addDiveLevel(uuid(), {
      depth: lastDepth + deltaMeters,
      duration: 20,
      gasId: NIL
    })
  }, [addDiveLevel])

  return (
    <div {...props}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('planner.levels.depth')}</TableHead>
            <TableHead>{t('planner.levels.duration')}</TableHead>
            <TableHead className="w-full"/>
            <TableHead className="w-[200px]">{t('planner.levels.gas')}</TableHead>
            <TableHead className="w-0"/>
          </TableRow>
        </TableHeader>
        <DivePlanTableBody />
      </Table>
      <Separator />
      <div className="text-right w-full p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <Plus className="mr-2 h-4 w-4"/>
              {t('planner.levels.add_button')}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {DEPTH_INCREMENTS_METERS.map(deltaMeters => (
              <DropdownMenuItem key={deltaMeters} onClick={() => addDeeperLevel(deltaMeters)}>
                +{deltaMeters} m
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
