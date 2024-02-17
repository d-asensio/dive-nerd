import {Label} from "@/components/ui/label";
import {InputWithUnits} from "@/components/app/input-with-units";
import * as React from "react";

export function ExternalBatteryVoltsField() {
  return (
    <div className="grid max-w-sm items-center gap-1.5">
      <Label htmlFor="external-battery-volts-input">Batería externa</Label>
      <InputWithUnits
        id="external-battery-volts-input"
        units="voltios"
        type="number"
        min={0}
        step={0.1}
        className="max-w-[150px] min-w-[120px]"
      />
    </div>
  );
}
