import {Label} from "@/components/ui/label";
import {InputWithUnits} from "@/components/app/input-with-units";
import * as React from "react";

interface BatteryVoltsFieldProps {
  name: string,
  label: string
}

export function BatteryVoltsField ({ name, label }: BatteryVoltsFieldProps) {
  return (
    <div className="grid items-center gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <InputWithUnits
        id={name}
        units="V"
        type="number"
        min={0}
        step={0.1}
        className="w-[200px] min-w-[120px]"
      />
    </div>
  );
}
