"use client"

import {Settings} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {DiveSettings} from "@/components/app/dive-settings"
import {useI18n} from "@/locales/client"

export function DiveSettingsPopover() {
  const t = useI18n()
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('planner.tabs.config')}>
          <Settings className="h-4 w-4"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(90vw,460px)] max-h-[80vh] overflow-y-auto">
        <DiveSettings/>
      </PopoverContent>
    </Popover>
  )
}
