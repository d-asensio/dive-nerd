import {Plus} from "lucide-react"
import { v1 as uuid} from "uuid"
import {Button} from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import * as React from "react";
import {useStore} from "@/state/store";
import {GasBadge} from "@/components/app/gas-badge";
import {Gas} from "@/utils/types";
import {maximumOperatingDepth} from "@/utils/maximum-operating-depth";
import {agencyGasPresets} from "@/utils/gas-presets";


function StandardGasMenuItem({ gas }: { gas: Gas }) {
  const addGas = useStore.use.addGas()

  const onMenuItemClick = React.useCallback(() => {
    addGas(uuid(), gas)
  }, [addGas, gas])

  return (
    <DropdownMenuItem onClick={onMenuItemClick}>
      <GasBadge gas={gas} className="mr-4"/>
      <DropdownMenuShortcut>{"≤"} {maximumOperatingDepth(gas)}m</DropdownMenuShortcut>
    </DropdownMenuItem>
  );
}

function AgencyGasSubmenu({ agency, bottom, deco }: { agency: string; bottom: Gas[]; deco: Gas[] }) {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <DropdownMenuLabel>{agency}</DropdownMenuLabel>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuLabel className="text-xs text-muted-foreground">Bottom & travel</DropdownMenuLabel>
          {bottom.map((gas, index) => (
            <StandardGasMenuItem key={`${agency}-bottom-${index}`} gas={gas} />
          ))}
          <DropdownMenuSeparator/>
          <DropdownMenuLabel className="text-xs text-muted-foreground">Deco</DropdownMenuLabel>
          {deco.map((gas, index) => (
            <StandardGasMenuItem key={`${agency}-deco-${index}`} gas={gas} />
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}

export function AddGasDropdown() {
  const addGas = useStore.use.addGas()

  const onAddGasButtonClick = React.useCallback(() => {
    addGas(
      uuid(),
      {
        isDecoGas: false,
        fO2: .21,
        fHe: 0
      }
    )
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
        {agencyGasPresets.map(preset => (
          <AgencyGasSubmenu
            key={preset.agency}
            agency={preset.agency}
            bottom={preset.bottom}
            deco={preset.deco}
          />
        ))}
        <DropdownMenuSeparator/>
        <DropdownMenuItem onClick={onAddGasButtonClick}>
          <Plus className="mr-2 h-4 w-4"/>
          <span>Custom gas</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
