import {Plus} from "lucide-react"
import { v1 as uuid} from "uuid"
import {Button} from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import * as React from "react";
import {useStore} from "@/state/store";
import {Gas} from "@/utils/types";
import {AgencyGasPresetSubmenus} from "@/components/app/gas-preset-menu";

export function AddGasDropdown() {
  const addGas = useStore.use.addGas()

  const onSelectPreset = React.useCallback((gas: Gas) => {
    addGas(uuid(), gas)
  }, [addGas])

  const onAddCustomGasClick = React.useCallback(() => {
    addGas(uuid(), { isDecoGas: false, fO2: .21, fHe: 0 })
  }, [addGas])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Plus className="mr-2 h-4 w-4"/>
          Add gas
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuSeparator/>
        <AgencyGasPresetSubmenus onSelect={onSelectPreset} />
        <DropdownMenuSeparator/>
        <DropdownMenuItem onClick={onAddCustomGasClick}>
          <Plus className="mr-2 h-4 w-4"/>
          <span>Custom gas</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
