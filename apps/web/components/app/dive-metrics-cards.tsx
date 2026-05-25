"use client"

import * as React from "react"
import {Clock, Timer, Waves} from "lucide-react"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {useSelector} from "@/state/useSelector"
import {diveMetricsSelector} from "@/state/dive-plan/selectors"

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

const formatMinutes = (minutes: number): string => {
  if (minutes <= 0) return "0 min"
  if (minutes < 1)  return "< 1 min"
  return `${Math.ceil(minutes)} min`
}

const formatDepth = (depth: number): string => `${depth.toFixed(1)} m`

export function DiveMetricsCards() {
  const {totalRunTime, totalDecoTime, averageDepth} = useSelector(diveMetricsSelector)

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <MetricCard
        label="Total dive time"
        value={formatMinutes(totalRunTime)}
        icon={<Clock className="h-4 w-4 text-muted-foreground"/>}
      />
      <MetricCard
        label="Total deco time"
        value={formatMinutes(totalDecoTime)}
        icon={<Timer className="h-4 w-4 text-amber-500"/>}
      />
      <MetricCard
        label="Average depth"
        value={formatDepth(averageDepth)}
        icon={<Waves className="h-4 w-4 text-blue-500"/>}
      />
    </div>
  )
}
