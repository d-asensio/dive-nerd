import {Label} from "@/components/ui/label";
import {InputWithUnits} from "@/components/app/input-with-units";
import * as React from "react";

interface TankPressureFieldProps {
  id: string,
  label: string
}

export function TankPressureField({id, label}: TankPressureFieldProps) {
  return (
    <div className="grid max-w-sm items-center gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <InputWithUnits
        id={id}
        units="bar"
        type="number"
        min={0}
        max={300}
        step={10}
        className="max-w-[150px] min-w-[120px]"
      />
    </div>
  );
}
