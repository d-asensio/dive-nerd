"use client"

import * as React from "react";

import {useFormContext} from "react-hook-form";

import type {FormValues} from "../schema";
import {useWatchTruthyFieldsPercentage} from "../hooks/use-watch-truthy-fields-percentage";

import {ChecklistSection} from "../checklist-section";
import {ChecklistStep} from "../checklist-step";
import {useScopedI18n} from "@/locales/client";

export function DiluentCalibrationChecklistSection() {
  const t = useScopedI18n("rebreather_checklists.shark.diluent_calibration_section")
  const form = useFormContext<FormValues>()
  const completePercentage = useWatchTruthyFieldsPercentage([
    'check_diluent_pressure_and_manual_addition',
    'check_automatic_diluent_valve',
    'check_diluent_flush',
    'check_diluent_leakage',
    'check_diluent_purge'
  ])

  return (
    <ChecklistSection
      title={t('title')}
      subtitle={t('subtitle')}
      completePercentage={completePercentage}
    >
      <ChecklistStep
        description={t('check_diluent_pressure_and_manual_addition_step')}
        name="check_diluent_pressure_and_manual_addition"
        control={form.control}
      />
      <ChecklistStep
        description={t('check_automatic_diluent_valve_step')}
        name="check_automatic_diluent_valve"
        control={form.control}
      />
      <ChecklistStep
        description={t('check_diluent_flush_step')}
        name="check_diluent_flush"
        control={form.control}
      />
      <ChecklistStep
        description={t('check_diluent_leakage_step')}
        name="check_diluent_leakage"
        control={form.control}
      />
      <ChecklistStep
        description={t('check_diluent_purge_step')}
        name="check_diluent_purge"
        control={form.control}
      />
    </ChecklistSection>
  )
}
