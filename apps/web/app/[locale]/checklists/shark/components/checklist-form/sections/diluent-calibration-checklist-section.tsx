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
  'check_diluent_pressure_and_manual_addition',
  'check_automatic_diluent_valve',
  'check_diluent_flush',
  'check_diluent_leakage',
  'check_diluent_purge'
]

export function DiluentCalibrationChecklistSection() {
  const t = useI18n()
  const scopedT = useScopedI18n("rebreather_checklists.shark.diluent_calibration_section")
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
        description={scopedT('check_diluent_pressure_and_manual_addition_step')}
        name="check_diluent_pressure_and_manual_addition"
        control={form.control}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      />
      <ChecklistStep
        description={scopedT('check_automatic_diluent_valve_step')}
        name="check_automatic_diluent_valve"
        control={form.control}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      />
      <ChecklistStep
        description={scopedT('check_diluent_flush_step')}
        name="check_diluent_flush"
        control={form.control}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      />
      <ChecklistStep
        description={scopedT('check_diluent_leakage_step')}
        name="check_diluent_leakage"
        control={form.control}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      />
      <ChecklistStep
        description={scopedT('check_diluent_purge_step')}
        name="check_diluent_purge"
        control={form.control}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      />
    </ChecklistSection>
  )
}
