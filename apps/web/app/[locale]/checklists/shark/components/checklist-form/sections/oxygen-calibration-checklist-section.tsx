"use client"

import * as React from "react";

import {useFormContext} from "react-hook-form";

import type {FormValues} from "../schema";
import {
  useWatchTruthyFieldsPercentage
} from "../hooks/use-watch-truthy-fields-percentage";

import {ChecklistSection} from "../checklist-section";
import {ChecklistStep} from "../checklist-step";
import {useScopedI18n} from "@/locales/client";
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
  const t = useScopedI18n("rebreather_checklists.shark.oxygen_calibration_section")
  const form = useFormContext<FormValues>()

  const completePercentage = useWatchTruthyFieldsPercentage(CHILD_FIELDS)
  const hasErrors = useWatchHasErrors(CHILD_FIELDS)

  return (
    <ChecklistSection
      title={t('title')}
      subtitle={t('subtitle')}
      completePercentage={completePercentage}
      hasErrors={hasErrors}
    >
      <ChecklistStep
        description={t('check_main_and_backup_computers_step')}
        name="check_main_and_backup_computers"
        control={form.control}
      />
      <ChecklistStep
        description={t('check_oxygen_pressure_and_manual_addition_step')}
        name="check_oxygen_pressure_and_manual_addition"
        control={form.control}
      />
      <ChecklistStep
        description={t('check_oxygen_flush_step')}
        name="check_oxygen_flush"
        control={form.control}
      />
      <ChecklistStep
        description={t('check_main_and_backup_calibration_step')}
        name="check_main_and_backup_calibration"
        control={form.control}
      />
      <ChecklistStep
        description={t('check_setpoint_step')}
        name="check_setpoint"
        control={form.control}
      />
      <ChecklistStep
        description={t('check_constant_mass_valve_step')}
        name="check_constant_mass_valve"
        control={form.control}
      />
    </ChecklistSection>
  )
}
