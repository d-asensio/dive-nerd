"use client"

import {buhlmannCompartments} from "dive-physics"

import {CompartmentGasLoadChart} from "@/components/app/compartment-gas-load-chart"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {useSelector} from "@/state/useSelector"
import {useI18n} from "@/locales/client"

export function IndividualCompartmentCharts() {
  const t = useI18n()
  const showIndividualCompartments = useSelector(state => state.showIndividualCompartments)

  if (!showIndividualCompartments) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('planner.tabs.individual_compartments')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {buhlmannCompartments.map((_, id) => (
            <div key={id} className="relative">
              <span className="absolute left-1 top-1 z-10 rounded-sm bg-background/70 px-1.5 text-[10px] font-semibold leading-5 text-muted-foreground tabular-nums">
                #{id + 1}
              </span>
              <CompartmentGasLoadChart compartmentId={id} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
