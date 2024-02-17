import {Label} from "@/components/ui/label";
import {InputWithUnits} from "@/components/app/input-with-units";
import * as React from "react";

interface TankPressureFieldProps {
  name: string,
  label: string
}

export function TankPressureField({name, label}: TankPressureFieldProps) {
  return (
    <div className="grid items-center gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <InputWithUnits
        id={name}
        units="bar"
        type="number"
        min={0}
        max={300}
        step={10}
        className="w-[200px] min-w-[120px]"
      />
    </div>
  );
}
