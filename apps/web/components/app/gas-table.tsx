"use client"

import * as React from "react";
import {Minus} from "lucide-react";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";

import {InputWithUnits} from "@/components/app/input-with-units";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

import {useSelector} from "@/state/useSelector";
import {isFirstGasSelector, gasByIdSelector} from "@/state/dive-gases/selectors";
import {ChangeEvent} from "react";
import {useStore} from "@/state/store";
import {GasBadge} from "@/components/app/gas-badge";
import {Separator} from "@/components/ui/separator";
import {AddGasDropdown} from "@/components/app/add-gas-dropdown";
import {maximumOperatingDepth} from "@/utils/maximum-operating-depth";
import {Switch} from "@/components/ui/switch";

const GasRow = React.memo(function GasRow({ id }: { id: string }) {
  const isFirst = useSelector(isFirstGasSelector, id)
  const gas = useSelector(gasByIdSelector, id)

  const removeGas = useStore.use.removeGas()
  const updateGas = useStore.use.updateGas()

  const handleO2FractionChange = React.useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const fO2 = parseInt(e.target.value, 10) / 100

    updateGas(id, { fO2 })
  }, [id, updateGas])

  const handleHeFractionChange = React.useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const fHe = parseInt(e.target.value, 10) / 100

    updateGas(id, { fHe })
  }, [id, updateGas])

  const handleIsDecoGasChange = React.useCallback((isDecoGas: boolean) => {
    updateGas(id, { isDecoGas })
  }, [id, updateGas])

  const handleRemoveButtonClick = React.useCallback(() => {
    removeGas(id)
  }, [id, removeGas])

  return (
    <TableRow>
      <TableCell>
        <div className='flex items-center space-x-2'>
          <InputWithUnits
            units='% O2'
            type="number"
            value={Math.round(gas.fO2 * 100)}
            onChange={handleO2FractionChange}
            min={0}
            max={100}
            step={1}
            className="max-w-[150px] min-w-[120px]"
          />
          <span>/</span>
          <InputWithUnits
            units='% He'
            type="number"
            value={Math.round(gas.fHe * 100)}
            onChange={handleHeFractionChange}
            min={0}
            max={100}
            step={1}
            className="max-w-[150px] min-w-[120px]"
          />
        </div>
      </TableCell>
      <TableCell>
        <GasBadge gas={gas} />
      </TableCell>
      <TableCell>
        <Switch
          checked={gas.isDecoGas}
          onCheckedChange={handleIsDecoGasChange}
        />
      </TableCell>
      <TableCell className='text-right whitespace-nowrap'>
        {maximumOperatingDepth(gas)} m
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
  const gasesIdList = useStore.use.gasesIdList()

  return (
    <TableBody>
      {gasesIdList.map(
        gasId => (
          <GasRow
            key={gasId}
            id={gasId}
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
            <TableHead className='w-full'>
              Is deco gas
            </TableHead>
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
        <AddGasDropdown />
      </div>
    </div>
  )
}
