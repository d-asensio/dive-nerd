"use client"

import * as React from "react";

import {Settings} from "lucide-react";

import {useStore} from "@/state/store";

import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";

import {InputWithUnits} from "@/components/app/input-with-units";

export function DiveSettings() {
  const descentRate = useStore.use.descentRate()
  const ascentRate = useStore.use.ascentRate()
  const setDescentRate = useStore.use.setDescentRate()
  const setAscentRate = useStore.use.setAscentRate()

  const handleDescentRateChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const descentRate = parseInt(e.target.value, 10)

    setDescentRate(descentRate)
  }, [setDescentRate])

  const handleAscentRateChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const ascentRate = parseInt(e.target.value, 10)

    setAscentRate(ascentRate)
  }, [setAscentRate])

  return (
    <div className="grid grid-cols-4 gap-4 p-6">
      <div className="grid items-center gap-4">
        <Label htmlFor="descent_rate">Descent rate</Label>
        <InputWithUnits
          id="descent_rate"
          units="m/min"
          type="number"
          value={descentRate}
          onChange={handleDescentRateChange}
          min={0}
          step={1}
        />
      </div>
      <div className="grid items-center gap-4">
        <Label htmlFor="maxWidth">Ascent rate</Label>
        <InputWithUnits
          id="ascent_rate"
          units="m/min"
          type="number"
          value={ascentRate}
          onChange={handleAscentRateChange}
          min={0}
          step={1}
        />
      </div>
    </div>
  )
}
