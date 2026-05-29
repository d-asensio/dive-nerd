import * as React from "react"
import {RefreshCw} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {AgencyGasPresetSubmenus} from "@/components/app/gas-preset-menu"
import {useStore} from "@/state/store"
import {Gas} from "@/utils/types"

/**
 * A small "change gas" control: pick a standard preset to set this gas's mix.
 * Only the O2/He fractions are applied — the deco/bottom role stays under the
 * row's toggle (and the first gas cannot become a deco gas).
 */
export function ChangeGasDropdown({ id }: { id: string }) {
  const updateGas = useStore.use.updateGas()

  const onSelectPreset = React.useCallback((gas: Gas) => {
    updateGas(id, { fO2: gas.fO2, fHe: gas.fHe })
  }, [id, updateGas])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 text-muted-foreground">
          <RefreshCw className="h-3.5 w-3.5"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <AgencyGasPresetSubmenus onSelect={onSelectPreset} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
