"use client"

import {Eye} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Switch} from "@/components/ui/switch"

import {useStore} from "@/state/store"
import {useI18n} from "@/locales/client"

/**
 * "View" menu in the top-right of the dive profile chart card — controls which
 * extra panels (combined compartments / individual compartments) render inside
 * the chart card. Same shape as the gear popovers on the other cards, just
 * with an eye icon to read as visibility rather than settings.
 */
export function ChartViewPopover() {
  const t = useI18n()
  const showCompartments = useStore.use.showCompartments()
  const showIndividualCompartments = useStore.use.showIndividualCompartments()
  const setShowCompartments = useStore.use.setShowCompartments()
  const setShowIndividualCompartments = useStore.use.setShowIndividualCompartments()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('planner.chart.views_label')}>
          <Eye className="h-4 w-4"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(90vw,360px)]">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Switch
              id="show_compartments"
              checked={showCompartments}
              onCheckedChange={setShowCompartments}
            />
            <div className="grid gap-1">
              <Label htmlFor="show_compartments">{t('planner.settings.show_compartments_label')}</Label>
              <p className="text-xs text-muted-foreground">
                {t('planner.settings.show_compartments_description')}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Switch
              id="show_individual_compartments"
              checked={showIndividualCompartments}
              onCheckedChange={setShowIndividualCompartments}
            />
            <div className="grid gap-1">
              <Label htmlFor="show_individual_compartments">{t('planner.settings.show_individual_compartments_label')}</Label>
              <p className="text-xs text-muted-foreground">
                {t('planner.settings.show_individual_compartments_description')}
              </p>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
