"use client"

import * as React from "react"

import {useSelector} from "@/state/useSelector"
import {totalDecoMinutesSelector} from "@/state/dive-plan/selectors"

const formatDuration = (minutes: number): string => {
  if (minutes <= 0) return "No decompression required"
  if (minutes < 1)  return "< 1 minute"
  return `${Math.ceil(minutes)} minutes`
}

export function DecompressionSummary() {
  const totalDecoMinutes = useSelector(totalDecoMinutesSelector)

  return <>{formatDuration(totalDecoMinutes)}</>
}
