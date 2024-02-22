"use client"

import * as React from "react";

import {useFormContext} from "react-hook-form";

import type {FormValues} from "../schema";
import {
  useWatchTruthyFieldsPercentage
} from "../hooks/use-watch-truthy-fields-percentage";

import {ChecklistSection} from "../checklist-section";
import {ChecklistStep} from "../checklist-step";
import {useI18n, useScopedI18n} from "@/locales/client";
import {
  useWatchHasErrors
} from "@/app/[locale]/checklists/shark/components/checklist-form/hooks/use-watch-has-errors";

const CHILD_FIELDS = [
  'check_bailout_pressure',
  'check_bailout_connections',
]

export function BailoutChecklistSection() {
  const t = useI18n()
  const scopedT = useScopedI18n("rebreather_checklists.shark.bailout_section")
  const form = useFormContext<FormValues>()

  const completePercentage = useWatchTruthyFieldsPercentage(CHILD_FIELDS)
  const hasErrors = useWatchHasErrors(CHILD_FIELDS)

  return (
    <ChecklistSection
      title={scopedT('title')}
      subtitle={scopedT('subtitle')}
      completePercentage={completePercentage}
      hasErrors={hasErrors}
    >
      <ChecklistStep
        description={scopedT('check_bailout_pressure_step')}
        name="check_bailout_pressure"
        control={form.control}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      />
      <ChecklistStep
        description={scopedT('check_bailout_connections_step')}
        name="check_bailout_connections"
        control={form.control}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      />
    </ChecklistSection>
  )
}
