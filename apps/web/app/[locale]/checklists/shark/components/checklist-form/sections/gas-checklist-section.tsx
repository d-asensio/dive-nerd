"use client"

import * as React from "react";

import {useFormContext} from "react-hook-form";

import type {FormValues} from "../schema";
import {
  useWatchTruthyFieldsPercentage
} from "../hooks/use-watch-truthy-fields-percentage";

import {ChecklistSection} from "../checklist-section";
import {ChecklistStep} from "../checklist-step";

import {GasOxygenPercentageField} from "../fields/gas-oxygen-percentage-field";
import {TankPressureField} from "../fields/tank-pressure-field";
import {useI18n, useScopedI18n} from "@/locales/client";
import {
  useWatchHasErrors
} from "@/app/[locale]/checklists/shark/components/checklist-form/hooks/use-watch-has-errors";

const CHILD_FIELDS = [
  'check_oxygen_percentage_and_pressure',
  'check_diluent_percentage_and_pressure'
]

export function GasChecklistSection() {
  const t = useI18n()
  const scopedT = useScopedI18n("rebreather_checklists.shark.gas_section")
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
        name="check_oxygen_percentage_and_pressure"
        description={scopedT('check_oxygen_percentage_and_pressure_step')}
        control={form.control}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      >
        <GasOxygenPercentageField
          name='oxygen_percentage_reading_field'
          label={scopedT('oxygen_percentage_reading_field.label')}
        />
        <TankPressureField
          name='oxygen_pressure_field'
          label={scopedT('oxygen_pressure_field.label')}
        />
      </ChecklistStep>
      <ChecklistStep
        description={scopedT('check_diluent_percentage_and_pressure_step')}
        name="check_diluent_percentage_and_pressure"
        control={form.control}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      >
        <GasOxygenPercentageField
          name='diluent_percentage_reading_field'
          label={scopedT('diluent_percentage_reading_field.label')}
        />
        <TankPressureField
          name='diluent_pressure_field'
          label={scopedT('diluent_pressure_field.label')}
        />
      </ChecklistStep>
    </ChecklistSection>
  )
}
