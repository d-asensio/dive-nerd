"use client"

import * as React from "react"

import {useSelector} from "@/state/useSelector"
import {totalDecoMinutesSelector} from "@/state/dive-plan/selectors"
import {useI18n} from "@/locales/client"

export function DecompressionSummary() {
  const t = useI18n()
  const totalDecoMinutes = useSelector(totalDecoMinutesSelector)

  if (totalDecoMinutes <= 0) return <>{t('planner.decompression.no_deco_required')}</>
  if (totalDecoMinutes < 1)  return <>{t('planner.units.minutes_long_less_than_one')}</>
  return <>{t('planner.units.minutes_long', { count: Math.ceil(totalDecoMinutes) })}</>
}
