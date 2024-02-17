import {Label} from "@/components/ui/label";
import {InputWithUnits} from "@/components/app/input-with-units";
import * as React from "react";

interface OxygenCellMillivoltsFieldProps {
  id: string,
  label: string
}

export function OxygenCellMillivoltsField({id, label}: OxygenCellMillivoltsFieldProps) {
  return (
    <div className="grid max-w-sm items-center gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <InputWithUnits
        id={id}
        units="mV"
        type="number"
        min={0}
        step={50}
        className="max-w-[150px] min-w-[120px]"
      />
    </div>
  );
}
