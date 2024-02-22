"use client"

import type {FormValues} from "../schema";
import * as React from "react";
import {z} from "zod";

import {useFormContext} from "react-hook-form";

import {useI18n, useScopedI18n} from "@/locales/client";

import {useWatchTruthyFieldsPercentage} from "../hooks/use-watch-truthy-fields-percentage";
import {useWatchHasErrors} from "../hooks/use-watch-has-errors";
import {NumberWithUnitsField} from "../fields/number-with-units-field";

import {ChecklistSection} from "../checklist-section";
import {ChecklistStep} from "../checklist-step";

const CHILD_FIELDS = [
  'check_oxygen_percentage_and_pressure',
  'check_diluent_percentage_and_pressure'
]

const sectionStepsSchema = z.object({
  check_oxygen_percentage_and_pressure: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_diluent_percentage_and_pressure: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  })
})

const oxygenTankFields = z.object({
  oxygen_percentage_reading_field: z.coerce.number(),
  oxygen_pressure_field: z.coerce.number()
})

const diluentTankFields = z.object({
  diluent_percentage_reading_field: z.coerce.number(),
  diluent_pressure_field: z.coerce.number()
})

export const gasSectionSchema = z.object({
  ...sectionStepsSchema.shape,
  ...oxygenTankFields.shape,
  ...diluentTankFields.shape,
})

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
        <NumberWithUnitsField
          label={scopedT('oxygen_percentage_reading_field.label')}
          units="% O2"
          name='oxygen_percentage_reading_field'
          control={form.control}
        />
        <NumberWithUnitsField
          label={scopedT('oxygen_pressure_field.label')}
          units="bar"
          name='oxygen_pressure_field'
          control={form.control}
        />
      </ChecklistStep>
      <ChecklistStep
        description={scopedT('check_diluent_percentage_and_pressure_step')}
        name="check_diluent_percentage_and_pressure"
        control={form.control}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      >
        <NumberWithUnitsField
          label={scopedT('diluent_percentage_reading_field.label')}
          units="% O2"
          name='diluent_percentage_reading_field'
          control={form.control}
        />
        <NumberWithUnitsField
          units="bar"
          label={scopedT('diluent_pressure_field.label')}
          name='diluent_pressure_field'
          control={form.control}
        />
      </ChecklistStep>
    </ChecklistSection>
  )
}
