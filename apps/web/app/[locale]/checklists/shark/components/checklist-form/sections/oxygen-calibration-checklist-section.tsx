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
  'check_main_and_backup_computers',
  'check_oxygen_pressure_and_manual_addition',
  'check_oxygen_flush',
  'check_main_and_backup_calibration',
  'check_setpoint',
  'check_constant_mass_valve'
]

export function OxygenCalibrationChecklistSection() {
  const t = useI18n()
  const scopedT = useScopedI18n("rebreather_checklists.shark.oxygen_calibration_section")
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
        description={scopedT('check_main_and_backup_computers_step')}
        name="check_main_and_backup_computers"
        control={form.control}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      />
      <ChecklistStep
        description={scopedT('check_oxygen_pressure_and_manual_addition_step')}
        name="check_oxygen_pressure_and_manual_addition"
        control={form.control}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      />
      <ChecklistStep
        description={scopedT('check_oxygen_flush_step')}
        name="check_oxygen_flush"
        control={form.control}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      />
      <ChecklistStep
        description={scopedT('check_main_and_backup_calibration_step')}
        name="check_main_and_backup_calibration"
        control={form.control}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      />
      <ChecklistStep
        description={scopedT('check_setpoint_step')}
        name="check_setpoint"
        control={form.control}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      />
      <ChecklistStep
        description={scopedT('check_constant_mass_valve_step')}
        name="check_constant_mass_valve"
        control={form.control}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      />
    </ChecklistSection>
  )
}
