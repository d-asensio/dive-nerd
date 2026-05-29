"use client"

import * as React from "react"
import {Clock, Timer, Waves} from "lucide-react"

import {useSelector} from "@/state/useSelector"
import {diveMetricsSelector} from "@/state/dive-plan/selectors"
import {useI18n} from "@/locales/client"

interface MetricRowProps {
  label: string
  value: string
  icon: React.ReactNode
}

const MetricRow = ({label, value, icon}: MetricRowProps) => (
  <div className="flex items-center justify-between gap-4">
    <span className="flex items-center gap-2 text-sm text-muted-foreground">
      {icon}
      {label}
    </span>
    <span className="text-sm font-semibold tabular-nums">{value}</span>
  </div>
)

const useFormatMinutesShort = () => {
  const t = useI18n()
  return React.useCallback((minutes: number): string => {
    if (minutes <= 0) return t('planner.units.minutes_short', { count: 0 })
    if (minutes < 1)  return t('planner.units.minutes_short_less_than_one')
    return t('planner.units.minutes_short', { count: Math.ceil(minutes) })
  }, [t])
}

export function DiveMetrics() {
  const t = useI18n()
  const {totalRunTime, totalDecoTime, averageDepth} = useSelector(diveMetricsSelector)
  const formatMinutes = useFormatMinutesShort()

  return (
    <div className="grid gap-3">
      <MetricRow
        label={t('planner.metrics.total_dive_time')}
        value={formatMinutes(totalRunTime)}
        icon={<Clock className="h-4 w-4 text-muted-foreground"/>}
      />
      <MetricRow
        label={t('planner.metrics.total_deco_time')}
        value={formatMinutes(totalDecoTime)}
        icon={<Timer className="h-4 w-4 text-amber-500"/>}
      />
      <MetricRow
        label={t('planner.metrics.average_depth')}
        value={`${averageDepth.toFixed(1)} m`}
        icon={<Waves className="h-4 w-4 text-blue-500"/>}
      />
    </div>
  )
}
