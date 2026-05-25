"use client"

import * as React from "react";

import {Settings} from "lucide-react";

import {useStore} from "@/state/store";

import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";

import {InputWithUnits} from "@/components/app/input-with-units";
import {useI18n} from "@/locales/client";

const parsePercentInput = (raw: string): number | null => {
  const parsed = parseInt(raw, 10)
  if (Number.isNaN(parsed)) return null
  if (parsed < 1 || parsed > 100) return null
  return parsed / 100
}

export function DiveSettings() {
  const t = useI18n()
  const descentRate = useStore.use.descentRate()
  const ascentRate = useStore.use.ascentRate()
  const gradientFactorLow = useStore.use.gradientFactorLow()
  const gradientFactorHigh = useStore.use.gradientFactorHigh()
  const switchAtMod = useStore.use.switchAtMod()
  const lastStopDepth = useStore.use.lastStopDepth()
  const setDescentRate = useStore.use.setDescentRate()
  const setAscentRate = useStore.use.setAscentRate()
  const setGradientFactorLow = useStore.use.setGradientFactorLow()
  const setGradientFactorHigh = useStore.use.setGradientFactorHigh()
  const setSwitchAtMod = useStore.use.setSwitchAtMod()
  const setLastStopDepth = useStore.use.setLastStopDepth()

  const handleLastStopAt6Change = React.useCallback((checked: boolean) => {
    setLastStopDepth(checked ? 6 : 3)
  }, [setLastStopDepth])

  const handleDescentRateChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const descentRate = parseInt(e.target.value, 10)
    if (!Number.isNaN(descentRate)) setDescentRate(descentRate)
  }, [setDescentRate])

  const handleAscentRateChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const ascentRate = parseInt(e.target.value, 10)
    if (!Number.isNaN(ascentRate)) setAscentRate(ascentRate)
  }, [setAscentRate])

  const handleGfLowChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parsePercentInput(e.target.value)
    if (value !== null) setGradientFactorLow(value)
  }, [setGradientFactorLow])

  const handleGfHighChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parsePercentInput(e.target.value)
    if (value !== null) setGradientFactorHigh(value)
  }, [setGradientFactorHigh])

  return (
    <div className="grid md:grid-cols-2 gap-4 p-6">
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
      <div className="grid items-center gap-4">
        <Label htmlFor="gf_low">{t('planner.settings.gradient_factor_low')}</Label>
        <InputWithUnits
          id="gf_low"
          units="%"
          type="number"
          value={Math.round(gradientFactorLow * 100)}
          onChange={handleGfLowChange}
          min={1}
          max={100}
          step={1}
        />
      </div>
      <div className="grid items-center gap-4">
        <Label htmlFor="gf_high">{t('planner.settings.gradient_factor_high')}</Label>
        <InputWithUnits
          id="gf_high"
          units="%"
          type="number"
          value={Math.round(gradientFactorHigh * 100)}
          onChange={handleGfHighChange}
          min={1}
          max={100}
          step={1}
        />
      </div>
      <div className="flex items-start gap-3 md:col-span-2 pt-2">
        <Switch
          id="switch_at_mod"
          checked={switchAtMod}
          onCheckedChange={setSwitchAtMod}
        />
        <div className="grid gap-1">
          <Label htmlFor="switch_at_mod">{t('planner.settings.switch_at_mod_label')}</Label>
          <p className="text-xs text-muted-foreground">
            {t('planner.settings.switch_at_mod_description')}
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3 md:col-span-2">
        <Switch
          id="last_stop_at_6"
          checked={lastStopDepth === 6}
          onCheckedChange={handleLastStopAt6Change}
        />
        <div className="grid gap-1">
          <Label htmlFor="last_stop_at_6">{t('planner.settings.last_stop_at_6_label')}</Label>
          <p className="text-xs text-muted-foreground">
            {t('planner.settings.last_stop_at_6_description')}
          </p>
        </div>
      </div>
    </div>
  )
}
