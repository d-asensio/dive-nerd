import {Label} from "@/components/ui/label";
import {InputWithUnits} from "@/components/app/input-with-units";
import * as React from "react";

interface OxygenCellMillivoltsFieldProps {
  name: string,
  label: string
}

export function OxygenCellMillivoltsField({name, label}: OxygenCellMillivoltsFieldProps) {
  return (
    <div className="grid items-center gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <InputWithUnits
        id={name}
        units="mV"
        type="number"
        min={0}
        step={50}
        className="w-[200px] min-w-[120px]"
      />
    </div>
  );
}
