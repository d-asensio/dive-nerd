import {Gas, GasType} from "@/utils/types";
import {gasTypeResolver} from "@/utils/gas-type-resolver";
import {gasFormatter} from "@/utils/gas-formatter";
import {Badge, BadgeProps} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import * as React from "react";

const gasTypeToColorClassMap = {
  [GasType.AIR]: 'bg-amber-400 hover:bg-amber-400/80',
  [GasType.NITROX]: 'bg-orange-400 hover:bg-orange-400/80',
  [GasType.HELITROX]: 'bg-indigo-400 hover:bg-indigo-400/80',
  [GasType.TRIMIX]: 'bg-indigo-600 hover:bg-indigo-600/80',
  [GasType.HELIOX]: 'bg-teal-600 hover:bg-teal-600/80',
  [GasType.OXYGEN]: 'bg-green-400 hover:bg-green-400/80',
  [GasType.IMPOSSIBLE_MIX]: 'bg-red-400 hover:bg-red-400/80',
}

export interface GasBadgeProps extends BadgeProps {
  gas: Gas
}

export function GasBadge({gas, className, ...props}: GasBadgeProps) {
  const gasType = React.useMemo(
    () => gasTypeResolver.resolve(gas),
    [gas]
  )
  const gasName =  React.useMemo(
    () => gasFormatter.format(gas),
    [gas]
  )

  return (
    <Badge
      className={cn(
        gasTypeToColorClassMap[gasType],
        "select-none whitespace-nowrap bg",
        className
      )}
      {...props}
    >
      {gasName}
    </Badge>
  );
}
