"use client"

import * as React from "react";

import {useFormContext} from "react-hook-form";

import type {FormValues} from "../schema";
import {useWatchTruthyFieldsPercentage} from "../hooks/use-watch-truthy-fields-percentage";

import {ChecklistSection} from "../checklist-section";
import {ChecklistStep} from "../checklist-step";

export function BailoutChecklistSection() {
  const form = useFormContext<FormValues>()
  const completePercentage = useWatchTruthyFieldsPercentage([
    'check_bailout_pressure',
    'check_bailout_connections',
  ])

  return (
    <ChecklistSection
      title="Bailout"
      subtitle="Checking your safety net"
      completePercentage={completePercentage}
    >
      <ChecklistStep
        description="Abrir el bailout, comprobar funcionamiento y presión"
        name="check_bailout_pressure"
        control={form.control}
      />
      <ChecklistStep
        description="Controlar las conexiones y cerrar bailout"
        name="check_bailout_connections"
        control={form.control}
      />
    </ChecklistSection>
  )
}
