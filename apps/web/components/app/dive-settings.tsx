"use client"

import * as React from "react";

import {useStore} from "@/state/store";

import {Label} from "@/components/ui/label";

import {InputWithUnits} from "@/components/app/input-with-units";
import {useI18n} from "@/locales/client";

export function DiveSettings() {
  const t = useI18n()
  const descentRate = useStore.use.descentRate()
  const ascentRate = useStore.use.ascentRate()
  const setDescentRate = useStore.use.setDescentRate()
  const setAscentRate = useStore.use.setAscentRate()

  const handleDescentRateChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const descentRate = parseInt(e.target.value, 10)
    if (!Number.isNaN(descentRate)) setDescentRate(descentRate)
  }, [setDescentRate])

  const handleAscentRateChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const ascentRate = parseInt(e.target.value, 10)
    if (!Number.isNaN(ascentRate)) setAscentRate(ascentRate)
  }, [setAscentRate])

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="grid items-center gap-4">
        <Label htmlFor="descent_rate">{t('planner.settings.descent_rate')}</Label>
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
        <Label htmlFor="ascent_rate">{t('planner.settings.ascent_rate')}</Label>
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
