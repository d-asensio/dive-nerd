"use client"

import * as React from "react"

import {useSelector} from "@/state/useSelector"
import {useStore} from "@/state/store"
import {cn} from "@/lib/utils"
import {useI18n} from "@/locales/client"

/**
 * Click-to-toggle legend above the dive profile chart. The Dive profile entry
 * is always on (it is the chart). The Ceiling and Gas switch entries reflect
 * (and drive) the `showCeiling` and `showGasSwitches` flags in the store, so
 * the legend is also where you turn those layers on and off.
 */
export function ChartLegend() {
  const t = useI18n()
  const showCeiling = useSelector(state => state.showCeiling)
  const showGasSwitches = useSelector(state => state.showGasSwitches)
  const setShowCeiling = useStore.use.setShowCeiling()
  const setShowGasSwitches = useStore.use.setShowGasSwitches()

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
      {/* Dive profile — always on, not interactive */}
      <span className="flex items-center gap-2">
        <span
          className="inline-block h-[2px] w-5 rounded-full"
          style={{ backgroundColor: "rgb(96, 165, 250)" }}
        />
        {t('planner.chart.legend.profile')}
      </span>

      <LegendToggle
        active={showCeiling}
        onToggle={() => setShowCeiling(!showCeiling)}
        label={t('planner.chart.tooltip.ceiling')}
        swatch={<span className="inline-block h-0.5 w-5 border-t-2 border-dashed border-amber-600"/>}
      />

      <LegendToggle
        active={showGasSwitches}
        onToggle={() => setShowGasSwitches(!showGasSwitches)}
        label={t('planner.chart.legend.gas_switch')}
        swatch={<span className="inline-block h-3 w-3 rounded-full border-2 border-slate-500 bg-white"/>}
      />
    </div>
  )
}

interface LegendToggleProps {
  active: boolean
  onToggle: () => void
  label: string
  swatch: React.ReactNode
}

function LegendToggle({ active, onToggle, label, swatch }: LegendToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-2 rounded-sm transition-opacity hover:opacity-100",
        active ? "opacity-100" : "opacity-40",
      )}
    >
      {swatch}
      <span className={cn("select-none", !active && "line-through")}>{label}</span>
    </button>
  )
}
