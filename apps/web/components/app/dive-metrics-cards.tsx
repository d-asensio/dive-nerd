"use client"

import * as React from "react"
import {Clock, Timer, Waves} from "lucide-react"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {useSelector} from "@/state/useSelector"
import {diveMetricsSelector} from "@/state/dive-plan/selectors"
import {useI18n} from "@/locales/client"

interface MetricCardProps {
  label: string
  value: string
  icon: React.ReactNode
}

const MetricCard = ({label, value, icon}: MetricCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {label}
      </CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
)

const useFormatMinutesShort = () => {
  const t = useI18n()
  return React.useCallback((minutes: number): string => {
    if (minutes <= 0) return t('planner.units.minutes_short', { count: 0 })
    if (minutes < 1)  return t('planner.units.minutes_short_less_than_one')
    return t('planner.units.minutes_short', { count: Math.ceil(minutes) })
  }, [t])
}

export function DiveMetricsCards() {
  const t = useI18n()
  const {totalRunTime, totalDecoTime, averageDepth} = useSelector(diveMetricsSelector)
  const formatMinutes = useFormatMinutesShort()

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <MetricCard
        label={t('planner.metrics.total_dive_time')}
        value={formatMinutes(totalRunTime)}
        icon={<Clock className="h-4 w-4 text-muted-foreground"/>}
      />
      <MetricCard
        label={t('planner.metrics.total_deco_time')}
        value={formatMinutes(totalDecoTime)}
        icon={<Timer className="h-4 w-4 text-amber-500"/>}
      />
      <MetricCard
        label={t('planner.metrics.average_depth')}
        value={`${averageDepth.toFixed(1)} m`}
        icon={<Waves className="h-4 w-4 text-blue-500"/>}
      />
    </div>
  )
}
