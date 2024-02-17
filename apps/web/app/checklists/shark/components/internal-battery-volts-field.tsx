import {Label} from "@/components/ui/label";
import {InputWithUnits} from "@/components/app/input-with-units";
import * as React from "react";

export function InternalBatteryVoltsField() {
  return (
    <div className="grid max-w-sm items-center gap-1.5">
      <Label htmlFor="internal-battery-volts-input">Batería interna</Label>
      <InputWithUnits
        id="internal-battery-volts-input"
        units="voltios"
        type="number"
        min={0}
        step={0.1}
        className="max-w-[150px] min-w-[120px]"
      />
    </div>
  );
}
