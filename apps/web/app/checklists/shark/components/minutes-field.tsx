import {Label} from "@/components/ui/label";
import {InputWithUnits} from "@/components/app/input-with-units";
import * as React from "react";

interface MinutesFieldProps {
  id: string,
  label: string
}

export function MinutesField({id, label}: MinutesFieldProps) {
  return (
    <div className="grid max-w-sm items-center gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <InputWithUnits
        id={id}
        units="minutos"
        type="number"
        min={0}
        step={1}
        className="max-w-[150px] min-w-[120px]"
      />
    </div>
  );
}
