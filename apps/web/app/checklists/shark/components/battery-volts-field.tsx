import {Label} from "@/components/ui/label";
import {InputWithUnits} from "@/components/app/input-with-units";
import * as React from "react";

interface BatteryVoltsFieldProps {
  id: string,
  label: string
}

export function BatteryVoltsField ({ id, label }: BatteryVoltsFieldProps) {
  return (
    <div className="grid max-w-sm items-center gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <InputWithUnits
        id={id}
        units="V"
        type="number"
        min={0}
        step={0.1}
        className="max-w-[150px] min-w-[120px]"
      />
    </div>
  );
}
