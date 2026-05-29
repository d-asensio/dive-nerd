"use client"

import * as React from "react"
import {ChangeEvent} from "react"
import {Minus, Plus} from "lucide-react"
import {NIL, v1 as uuid} from "uuid"

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Button} from "@/components/ui/button"
import {Separator} from "@/components/ui/separator"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {InputWithUnits} from "@/components/app/input-with-units"
import {GasSelector} from "@/components/app/gas-selector"
import {TankIcon} from "@/components/app/tank-icon"

import {useStore} from "@/state/store"
import {Tank} from "@/state/tanks/types"
import {tankFreeGasLiters, tankLibrary, tankModelOf} from "@/utils/tank-library"
import {useI18n} from "@/locales/client"

const DEFAULT_TANK_PRESSURE_BAR = 200

const formatLiters = (liters: number): string =>
  `${Math.round(liters).toLocaleString()} L`

const TankRow = React.memo(function TankRow({ id }: { id: string }) {
  const t = useI18n()
  const tank = useStore(state => state.tanksMap[id])
  const updateTank = useStore.use.updateTank()
  const removeTank = useStore.use.removeTank()

  const model = tankModelOf(tank.modelId)

  const handleGasChange = React.useCallback((gasId: string) => {
    updateTank(id, { gasId })
  }, [id, updateTank])

  const handlePressureChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const pressure = parseInt(event.target.value, 10)
    if (!Number.isNaN(pressure)) updateTank(id, { pressure })
  }, [id, updateTank])

  const handleRemove = React.useCallback(() => {
    removeTank(id)
  }, [id, removeTank])

  if (!model) return null

  const totalGas = tankFreeGasLiters(model, tank.pressure)
  const isDoubled = model.id.startsWith("Twin")
  const cylinderVolume = isDoubled ? model.waterVolumeLiters / 2 : model.waterVolumeLiters

  return (
    <TableRow>
      <TableCell className="whitespace-nowrap">
        <TankIcon
          waterVolumeLiters={cylinderVolume}
          material={model.material}
          doubled={isDoubled}
        />
      </TableCell>
      <TableCell className="whitespace-nowrap font-medium">{model.label}</TableCell>
      <TableCell className="w-[200px]">
        <GasSelector value={tank.gasId} onValueChange={handleGasChange}/>
      </TableCell>
      <TableCell>
        <InputWithUnits
          units="bar"
          type="number"
          value={tank.pressure}
          onChange={handlePressureChange}
          min={0}
          step={10}
          className="max-w-[140px] min-w-[120px]"
        />
      </TableCell>
      <TableCell className="whitespace-nowrap font-semibold tabular-nums">
        {formatLiters(totalGas)}
      </TableCell>
      <TableCell className="w-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="outline" onClick={handleRemove}>
              <Minus className="h-4 w-4"/>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t('planner.tanks.remove_tooltip')}</TooltipContent>
        </Tooltip>
      </TableCell>
    </TableRow>
  )
})

const TankTableBody = () => {
  const tanksIdList = useStore.use.tanksIdList()
  return (
    <TableBody>
      {tanksIdList.map(tankId => (
        <TankRow key={tankId} id={tankId}/>
      ))}
    </TableBody>
  )
}

function AddTankDropdown() {
  const t = useI18n()
  const addTank = useStore.use.addTank()
  const handleAdd = React.useCallback((modelId: string) => {
    const tank: Tank = {
      modelId,
      gasId: NIL,
      pressure: DEFAULT_TANK_PRESSURE_BAR,
    }
    addTank(uuid(), tank)
  }, [addTank])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Plus className="mr-2 h-4 w-4"/>
          {t('planner.tanks.add_button')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {tankLibrary.map(model => (
          <DropdownMenuItem key={model.id} onClick={() => handleAdd(model.id)}>
            <TankIcon
              waterVolumeLiters={model.id.startsWith("Twin") ? model.waterVolumeLiters / 2 : model.waterVolumeLiters}
              material={model.material}
              doubled={model.id.startsWith("Twin")}
              className="mr-3"
            />
            {model.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const TankTable = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const t = useI18n()
  return (
    <div className={className} {...props}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead/>
            <TableHead>{t('planner.tanks.model')}</TableHead>
            <TableHead className="w-[200px]">{t('planner.gases.gas')}</TableHead>
            <TableHead>{t('planner.tanks.pressure')}</TableHead>
            <TableHead className="whitespace-nowrap">{t('planner.tanks.total_gas')}</TableHead>
            <TableHead className="w-0"/>
          </TableRow>
        </TableHeader>
        <TankTableBody/>
      </Table>
      <Separator/>
      <div className="text-right w-full p-4">
        <AddTankDropdown/>
      </div>
    </div>
  )
}
