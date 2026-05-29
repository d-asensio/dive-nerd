"use client"

import * as React from "react"
import {ChangeEvent} from "react"
import {Settings} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"

import {InputWithUnits} from "@/components/app/input-with-units"
import {useStore} from "@/state/store"
import {useI18n} from "@/locales/client"

export function GasManagementSettingsPopover() {
  const t = useI18n()
  const sacRate = useStore.use.sacRate()
  const setSacRate = useStore.use.setSacRate()

  const handleSacRateChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10)
    if (!Number.isNaN(value)) setSacRate(value)
  }, [setSacRate])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('planner.tabs.config')}>
          <Settings className="h-4 w-4"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(90vw,360px)]">
        <div className="grid items-center gap-2">
          <Label htmlFor="sac_rate">{t('planner.settings.sac_rate_label')}</Label>
          <InputWithUnits
            id="sac_rate"
            units="L/min"
            type="number"
            value={sacRate}
            onChange={handleSacRateChange}
            min={1}
            step={1}
          />
          <p className="text-xs text-muted-foreground">
            {t('planner.settings.sac_rate_description')}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
