import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
  PlusIcon
} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
import {GasMix} from "@/utils/types";

function StandardGasMenuItem({ gasMix }: { gasMix: GasMix }) {
  const addGasMix = useStore.use.addGasMix()

  const onMenuItemClick = React.useCallback(() => {
    addGasMix(gasMix)
  }, [addGasMix, gasMix])

  return (
    <DropdownMenuItem onClick={onMenuItemClick}>
      <GasBadge gasMix={gasMix} className="mr-4"/>
      <DropdownMenuShortcut>{"≤"} 33m</DropdownMenuShortcut>
    </DropdownMenuItem>
  );
}

export function AddGasMixDropdown() {
  const addGasMix = useStore.use.addGasMix()

  const onAddMixButtonClick = React.useCallback(() => {
    addGasMix({
      fO2: 0,
      fHe: 0
    })
  }, [addGasMix])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Plus className="mr-2 h-4 w-4"/>
          Add mix
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
              <StandardGasMenuItem gasMix={{fO2: .32, fHe: 0}} />
              <StandardGasMenuItem gasMix={{fO2: .25, fHe: .25}}/>
              <StandardGasMenuItem gasMix={{fO2: .21, fHe: .35}}/>
              <StandardGasMenuItem gasMix={{fO2: .18, fHe: .45}}/>
              <StandardGasMenuItem gasMix={{fO2: .15, fHe: .55}}/>
              <StandardGasMenuItem gasMix={{fO2: .12, fHe: .60}}/>
              <StandardGasMenuItem gasMix={{fO2: .12, fHe: .65}}/>
              <StandardGasMenuItem gasMix={{fO2: .10, fHe: .70}}/>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <DropdownMenuLabel>Deco gas</DropdownMenuLabel>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <StandardGasMenuItem gasMix={{fO2: 1, fHe: 0}}/>
              <StandardGasMenuItem gasMix={{fO2: .5, fHe: 0}}/>
              <StandardGasMenuItem gasMix={{fO2: .35, fHe: .25}}/>
              <StandardGasMenuItem gasMix={{fO2: .21, fHe: .35}}/>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator/>
        <DropdownMenuItem onClick={onAddMixButtonClick}>
          <Plus className="mr-2 h-4 w-4"/>
          <span>Custom gas</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
