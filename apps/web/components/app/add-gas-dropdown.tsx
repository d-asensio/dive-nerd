import {Plus} from "lucide-react"

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


function StandardGasMenuItem({ gas }: { gas: Gas }) {
  const addGas = useStore.use.addGas()

  const onMenuItemClick = React.useCallback(() => {
    addGas(gas)
  }, [addGas, gas])

  return (
    <DropdownMenuItem onClick={onMenuItemClick}>
      <GasBadge gas={gas} className="mr-4"/>
      <DropdownMenuShortcut>{"≤"} {maximumOperatingDepth(gas)}m</DropdownMenuShortcut>
    </DropdownMenuItem>
  );
}

export function AddGasDropdown() {
  const addGas = useStore.use.addGas()

  const onAddGasButtonClick = React.useCallback(() => {
    addGas({
      fO2: 0,
      fHe: 0
    })
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
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <DropdownMenuLabel>Bottom gas</DropdownMenuLabel>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <StandardGasMenuItem gas={{fO2: .32, fHe: 0}} />
              <StandardGasMenuItem gas={{fO2: .25, fHe: .25}}/>
              <StandardGasMenuItem gas={{fO2: .21, fHe: .35}}/>
              <StandardGasMenuItem gas={{fO2: .18, fHe: .45}}/>
              <StandardGasMenuItem gas={{fO2: .15, fHe: .55}}/>
              <StandardGasMenuItem gas={{fO2: .12, fHe: .60}}/>
              <StandardGasMenuItem gas={{fO2: .12, fHe: .65}}/>
              <StandardGasMenuItem gas={{fO2: .10, fHe: .70}}/>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <DropdownMenuLabel>Deco gas</DropdownMenuLabel>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <StandardGasMenuItem gas={{fO2: 1, fHe: 0}}/>
              <StandardGasMenuItem gas={{fO2: .5, fHe: 0}}/>
              <StandardGasMenuItem gas={{fO2: .35, fHe: .25}}/>
              <StandardGasMenuItem gas={{fO2: .21, fHe: .35}}/>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator/>
        <DropdownMenuItem onClick={onAddGasButtonClick}>
          <Plus className="mr-2 h-4 w-4"/>
          <span>Custom gas</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
