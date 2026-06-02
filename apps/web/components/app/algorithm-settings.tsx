"use client"

import * as React from "react"

import {useStore} from "@/state/store"
import {Label} from "@/components/ui/label"
import {Switch} from "@/components/ui/switch"
import {InputWithUnits} from "@/components/app/input-with-units"
import {BottomGasSelector} from "@/components/app/bottom-gas-selector"
import {useI18n} from "@/locales/client"

const parsePercentInput = (raw: string): number | null => {
  const parsed = parseInt(raw, 10)
  if (Number.isNaN(parsed)) return null
  if (parsed < 1 || parsed > 100) return null
  return parsed / 100
}

const parseSetpointInput = (raw: string): number | null => {
  const parsed = parseFloat(raw)
  if (Number.isNaN(parsed)) return null
  if (parsed < 0.4 || parsed > 1.6) return null
  return parsed
}

/**
 * The parameters that shape the decompression algorithm itself: circuit
 * (OC / CCR), gradient factors and the procedural switches. CCR adds the two
 * pO₂ setpoints and the diluent; the OC-only "switch at MOD" control is hidden
 * on the loop.
 */
export function AlgorithmSettings() {
  const t = useI18n()
  const gradientFactorLow = useStore.use.gradientFactorLow()
  const gradientFactorHigh = useStore.use.gradientFactorHigh()
  const switchAtMod = useStore.use.switchAtMod()
  const lastStopDepth = useStore.use.lastStopDepth()
  const setGradientFactorLow = useStore.use.setGradientFactorLow()
  const setGradientFactorHigh = useStore.use.setGradientFactorHigh()
  const setSwitchAtMod = useStore.use.setSwitchAtMod()
  const setLastStopDepth = useStore.use.setLastStopDepth()

  const circuit = useStore.use.circuit()
  const setpointLow = useStore.use.setpointLow()
  const setpointHigh = useStore.use.setpointHigh()
  const diluentGasId = useStore.use.diluentGasId()
  const setCircuit = useStore.use.setCircuit()
  const setSetpointLow = useStore.use.setSetpointLow()
  const setSetpointHigh = useStore.use.setSetpointHigh()
  const setDiluentGasId = useStore.use.setDiluentGasId()

  const isCcr = circuit === 'CCR'

  const handleCircuitChange = React.useCallback((checked: boolean) => {
    setCircuit(checked ? 'CCR' : 'OC')
  }, [setCircuit])

  const handleSetpointLowChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseSetpointInput(e.target.value)
    if (value !== null) setSetpointLow(value)
  }, [setSetpointLow])

  const handleSetpointHighChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseSetpointInput(e.target.value)
    if (value !== null) setSetpointHigh(value)
  }, [setSetpointHigh])

  const handleLastStopAt6Change = React.useCallback((checked: boolean) => {
    setLastStopDepth(checked ? 6 : 3)
  }, [setLastStopDepth])

  const handleGfLowChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parsePercentInput(e.target.value)
    if (value !== null) setGradientFactorLow(value)
  }, [setGradientFactorLow])

  const handleGfHighChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parsePercentInput(e.target.value)
    if (value !== null) setGradientFactorHigh(value)
  }, [setGradientFactorHigh])

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="flex items-start gap-3 md:col-span-2">
        <Switch
          id="circuit_ccr"
          checked={isCcr}
          onCheckedChange={handleCircuitChange}
        />
        <div className="grid gap-1">
          <Label htmlFor="circuit_ccr">Closed circuit (CCR)</Label>
          <p className="text-xs text-muted-foreground">
            Hold a constant pO₂ setpoint on the loop instead of breathing a fixed open-circuit mix.
          </p>
        </div>
      </div>

      {isCcr && (
        <>
          <div className="grid items-center gap-4">
            <Label htmlFor="setpoint_low">Setpoint — descent &amp; bottom</Label>
            <InputWithUnits
              id="setpoint_low"
              units="bar"
              type="number"
              value={setpointLow}
              onChange={handleSetpointLowChange}
              min={0.4}
              max={1.6}
              step={0.1}
            />
          </div>
          <div className="grid items-center gap-4">
            <Label htmlFor="setpoint_high">Setpoint — ascent &amp; deco</Label>
            <InputWithUnits
              id="setpoint_high"
              units="bar"
              type="number"
              value={setpointHigh}
              onChange={handleSetpointHighChange}
              min={0.4}
              max={1.6}
              step={0.1}
            />
          </div>
          <div className="grid items-center gap-4 md:col-span-2">
            <Label htmlFor="diluent">Diluent</Label>
            <BottomGasSelector
              value={diluentGasId}
              onValueChange={setDiluentGasId}
            />
          </div>
        </>
      )}

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

      {!isCcr && (
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
      )}

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
