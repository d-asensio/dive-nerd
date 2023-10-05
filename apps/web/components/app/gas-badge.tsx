import {GasMix, GasMixType} from "@/utils/types";
import {gasMixTypeResolver} from "@/utils/gasMixTypeResolver";
import {gasMixFormatter} from "@/utils/gasMixFormatter";
import {Badge, BadgeProps} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import * as React from "react";

const gasMixTypeToColorClassMap = {
  [GasMixType.AIR]: 'bg-amber-400 hover:bg-amber-400/80',
  [GasMixType.NITROX]: 'bg-orange-400 hover:bg-orange-400/80',
  [GasMixType.HELITROX]: 'bg-indigo-400 hover:bg-indigo-400/80',
  [GasMixType.TRIMIX]: 'bg-indigo-600 hover:bg-indigo-600/80',
  [GasMixType.HELIOX]: 'bg-teal-600 hover:bg-teal-600/80',
  [GasMixType.OXYGEN]: 'bg-green-400 hover:bg-green-400/80',
}

interface GasBadgeProps extends BadgeProps {
  gasMix: GasMix
}

export function GasBadge({gasMix, className, ...props}: GasBadgeProps) {
  const gasType = React.useMemo(
    () => gasMixTypeResolver.resolve(gasMix),
    [gasMix]
  )
  const gasName =  React.useMemo(
    () => gasMixFormatter.format(gasMix),
    [gasMix]
  )

  return (
    <Badge
      className={cn(
        gasMixTypeToColorClassMap[gasType],
        "select-none whitespace-nowrap bg",
        className
      )}
      {...props}
    >
      {gasName}
    </Badge>
  );
}
