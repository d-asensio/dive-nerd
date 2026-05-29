import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import {GasBadge} from "@/components/app/gas-badge"
import {Gas} from "@/utils/types"
import {maximumOperatingDepth} from "@/utils/maximum-operating-depth"
import {agencyGasPresets} from "@/utils/gas-presets"

function PresetGasMenuItem({ gas, onSelect }: { gas: Gas; onSelect: (gas: Gas) => void }) {
  return (
    <DropdownMenuItem onClick={() => onSelect(gas)}>
      <GasBadge gas={gas} className="mr-4"/>
      <DropdownMenuShortcut>{"≤"} {maximumOperatingDepth(gas)}m</DropdownMenuShortcut>
    </DropdownMenuItem>
  )
}

/**
 * The agency standard-gas submenus (UTD / GUE / TDI), grouped into bottom and
 * deco gases. Shared by the "add gas" and "change gas" dropdowns — `onSelect`
 * decides what happens with the chosen preset.
 */
export function AgencyGasPresetSubmenus({ onSelect }: { onSelect: (gas: Gas) => void }) {
  return (
    <>
      {agencyGasPresets.map(({ agency, bottom, deco }) => (
        <DropdownMenuSub key={agency}>
          <DropdownMenuSubTrigger>
            <DropdownMenuLabel>{agency}</DropdownMenuLabel>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuLabel className="text-xs text-muted-foreground">Bottom & travel</DropdownMenuLabel>
              {bottom.map((gas, index) => (
                <PresetGasMenuItem key={`${agency}-bottom-${index}`} gas={gas} onSelect={onSelect} />
              ))}
              <DropdownMenuSeparator/>
              <DropdownMenuLabel className="text-xs text-muted-foreground">Deco</DropdownMenuLabel>
              {deco.map((gas, index) => (
                <PresetGasMenuItem key={`${agency}-deco-${index}`} gas={gas} onSelect={onSelect} />
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      ))}
    </>
  )
}
