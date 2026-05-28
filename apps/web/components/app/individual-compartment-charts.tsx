"use client"

import * as React from "react"
import {
  buhlmannCompartments,
  divingCeilingLeadingCompartmentIndex,
  gradientFactorAt,
} from "dive-physics"

import {CompartmentGasLoadChart} from "@/components/app/compartment-gas-load-chart"
import {useSelector} from "@/state/useSelector"
import {diveProfileSamplesSelector, firstStopAmbientPressureSelector} from "@/state/dive-plan/selectors"
import {surfaceAmbientPressure} from "@/utils/calculate-dive-profile"
import {cn} from "@/lib/utils"
import {useI18n} from "@/locales/client"

const compartmentCoefficients = buhlmannCompartments.map(c => ({
  nitrogen: { a: c.N2.a, b: c.N2.b },
  helium:   { a: c.He.a, b: c.He.b },
}))

export function IndividualCompartmentCharts() {
  const t = useI18n()
  const showIndividualCompartments = useSelector(state => state.showIndividualCompartments)
  const samples = useSelector(diveProfileSamplesSelector)
  const hoverTime = useSelector(state => state.hoverTime)
  const gfLow = useSelector(state => state.gradientFactorLow)
  const gfHigh = useSelector(state => state.gradientFactorHigh)
  const firstStopAmbientPressure = useSelector(firstStopAmbientPressureSelector)

  // The compartment whose ceiling is deepest at the active time — the one
  // dictating the next deco stop. Falls back to the end of the dive when the
  // user isn't actively hovering. Pure computation; safe to run conditionally
  // because the hooks above are unconditional.
  const leadingCompartmentIndex = React.useMemo(() => {
    if (samples.length === 0) return null
    const targetTime = hoverTime ?? samples[samples.length - 1].x
    const sample = samples.find(s => s.x >= targetTime) ?? samples[samples.length - 1]
    const gradientFactor = gradientFactorAt({
      bounds: { gfLow, gfHigh },
      firstStopAmbientPressure,
      surfaceAmbientPressure,
      ambientPressure: sample.ambientPressure,
    })
    return divingCeilingLeadingCompartmentIndex({
      compartmentLoads: sample.compartmentInertGasLoads.map(load => ({
        nitrogenPartialPressure: load.N2,
        heliumPartialPressure: load.He,
      })),
      compartmentCoefficients,
      gradientFactor,
    })
  }, [samples, hoverTime, gfLow, gfHigh, firstStopAmbientPressure])

  if (!showIndividualCompartments) return null

  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold">{t('planner.tabs.individual_compartments')}</h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {buhlmannCompartments.map((_, id) => {
          const isLeading = id === leadingCompartmentIndex
          return (
            <div
              key={id}
              className={cn(
                "relative rounded-md transition-colors",
                isLeading && "bg-amber-50 ring-2 ring-amber-500/40",
              )}
            >
              <span className="absolute left-1 top-1 z-10 rounded-sm bg-background/70 px-1.5 text-[10px] font-semibold leading-5 text-muted-foreground tabular-nums">
                #{id + 1}
              </span>
              <CompartmentGasLoadChart compartmentId={id} />
            </div>
          )
        })}
      </div>
    </section>
  )
}
