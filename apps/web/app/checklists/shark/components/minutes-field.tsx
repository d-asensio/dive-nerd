import {Label} from "@/components/ui/label";
import {InputWithUnits} from "@/components/app/input-with-units";
import * as React from "react";

interface MinutesFieldProps {
  name: string,
  label: string
}

export function MinutesField({name, label}: MinutesFieldProps) {
  return (
    <div className="grid items-center gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <InputWithUnits
        id={name}
        units="minutos"
        type="number"
        min={0}
        step={1}
        className="w-[200px] min-w-[120px]"
      />
    </div>
  );
}
