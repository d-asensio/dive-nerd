"use client"

import * as React from "react";
import {Minus, Plus} from "lucide-react";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";

import {InputWithUnits} from "@/components/app/input-with-units";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

import {useSelector} from "@/state/useSelector";
import {isFirstMixSelector, mixByIdSelector} from "@/state/dive-gases/selectors";
import {ChangeEvent} from "react";
import {useStore} from "@/state/store";
import {GasBadge} from "@/components/app/gas-badge";
import {Separator} from "@/components/ui/separator";
import {AddGasMixDropdown} from "@/components/app/add-gas-mix-dropdown";
import {maximumOperatingDepth} from "@/utils/maximum-operating-depth";

const GasRow = React.memo(function GasRow({ id }: { id: string }) {
  const isFirst = useSelector(isFirstMixSelector, id)
  const gasMix = useSelector(mixByIdSelector, id)

  const removeGasMix = useStore.use.removeGasMix()
  const updateGasMix = useStore.use.updateGasMix()

  const handleO2FractionChange = React.useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const fO2 = parseFloat(e.target.value)

    updateGasMix(id, { fO2 })
  }, [id, updateGasMix])

  const handleHeFractionChange = React.useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const fHe = parseFloat(e.target.value)

    updateGasMix(id, { fHe })
  }, [id, updateGasMix])

  const handleRemoveButtonClick = React.useCallback(() => {
    removeGasMix(id)
  }, [id, removeGasMix])

  return (
    <TableRow>
      <TableCell>
        <div className='flex items-center space-x-2'>
          <InputWithUnits
            units='O2'
            type="number"
            value={gasMix.fO2}
            onChange={handleO2FractionChange}
            min={0}
            max={1}
            step={.01}
            className="max-w-[150px] min-w-[120px]"
          />
          <span>/</span>
          <InputWithUnits
            units='He'
            type="number"
            value={gasMix.fHe}
            onChange={handleHeFractionChange}
            min={0}
            max={1}
            step={.01}
            className="max-w-[150px] min-w-[120px]"
          />
        </div>
      </TableCell>
      <TableCell>
        <GasBadge gasMix={gasMix} />
      </TableCell>
      <TableCell className='text-right'>
        {maximumOperatingDepth(gasMix)} m
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
              ? 'First gas cannot be removed'
              : 'Remove gas'}
          </TooltipContent>
        </Tooltip>
      </TableCell>
    </TableRow>
  )
})

const GasTableBody = () => {
  const mixesIdList = useStore.use.mixesIdList()

  return (
    <TableBody>
      {mixesIdList.map(
        mixId => (
          <GasRow
            key={mixId}
            id={mixId}
          />
        )
      )}
    </TableBody>
  )
}

export const GasTable = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div>
      <Table {...props}>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">
              Gas
            </TableHead>
            <TableHead className="w-0"/>
            <TableHead className='text-right'>
              MOD
            </TableHead>
            <TableHead className="w-0"/>
          </TableRow>
        </TableHeader>
        <GasTableBody />
      </Table>
      <Separator />
      <div className="text-right w-full p-4">
        <AddGasMixDropdown />
      </div>
    </div>
  )
}
