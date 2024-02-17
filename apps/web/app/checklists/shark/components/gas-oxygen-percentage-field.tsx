import {Label} from "@/components/ui/label";
import {InputWithUnits} from "@/components/app/input-with-units";
import * as React from "react";

interface GasOxygenPercentageFieldProps {
  id: string,
  label: string
}

export function GasOxygenPercentageField({id, label}: GasOxygenPercentageFieldProps) {
  return (
    <div className="grid max-w-sm items-center gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <InputWithUnits
        id={id}
        units="% O2"
        type="number"
        min={1}
        max={100}
        step={1}
        className="max-w-[150px] min-w-[120px]"
      />
    </div>
  );
}
