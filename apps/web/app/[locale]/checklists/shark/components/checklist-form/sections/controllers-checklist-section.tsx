"use client"

import type {FormValues} from "../schema";
import * as React from "react";

import {useFormContext} from "react-hook-form";
import {z} from "zod";

import {useI18n, useScopedI18n} from "@/locales/client";

import {useWatchTruthyFieldsPercentage} from "../hooks/use-watch-truthy-fields-percentage";

import {ChecklistSection} from "../checklist-section";
import {ChecklistStep} from "../checklist-step";

import {NumberWithUnitsField} from "../fields/number-with-units-field";
import {OxygenCellInstallationDateField} from "../fields/oxygen-cell-installation-date-field";
import {useWatchHasErrors} from "../hooks/use-watch-has-errors";
import {useWatchValidSchema} from "../hooks/use-watch-valid-schema";

const CHILD_FIELDS = [
  'check_controller_battery',
  'check_oxygen_cells_voltage',
  'check_oxygen_cells_installation_date',
  'check_dive_parameters'
]

const sectionStepsSchema = z.object({
  check_controller_battery: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_oxygen_cells_voltage: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_oxygen_cells_installation_date: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_dive_parameters: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
})

const cellVoltageFieldsSchema = z.object({
  cell_one_millivolts_field: z.coerce.number()
    .gt(9, {
      message: "rebreather_checklists.shark.controllers_section.cell_one_voltage_field.error.is_too_low"
    }),
  cell_two_millivolts_field: z.coerce.number()
    .gt(9, {
      message: "rebreather_checklists.shark.controllers_section.cell_two_voltage_field.error.is_too_low"
    }),
  cell_three_millivolts_field: z.coerce.number()
    .gt(9, {
      message: "rebreather_checklists.shark.controllers_section.cell_three_voltage_field.error.is_too_low"
    }),
})

const controllerBatteryFieldsSchema = z.object({
  internal_battery_volts_field: z.coerce.number()
    .gt(0, {
      message: "rebreather_checklists.shark.controllers_section.internal_battery_voltage_field.error.is_too_low"
    }),
  external_battery_volts_field: z.coerce.number()
    .gt(0, {
      message: "rebreather_checklists.shark.controllers_section.external_battery_voltage_field.error.is_too_low"
    }),
})

const cellInstallationDateFields = z.object({
  cell_one_installation_date_field: z.date({
    required_error: "rebreather_checklists.shark.controllers_section.cell_one_date_field.error.is_required",
  }),
  cell_two_installation_date_field: z.date({
    required_error: "rebreather_checklists.shark.controllers_section.cell_two_date_field.error.is_required",
  }),
  cell_three_installation_date_field: z.date({
    required_error: "rebreather_checklists.shark.controllers_section.cell_three_date_field.error.is_required",
  }),
})

export const controllersSectionSchema = z.object({
  ...sectionStepsSchema.shape,
  ...controllerBatteryFieldsSchema.shape,
  ...cellVoltageFieldsSchema.shape,
  ...cellInstallationDateFields.shape,
})

export function ControllersChecklistSection() {
  const t = useI18n()
  const scopedT = useScopedI18n("rebreather_checklists.shark.controllers_section")
  const form = useFormContext<FormValues>()
  const completePercentage = useWatchTruthyFieldsPercentage(CHILD_FIELDS)
  const hasErrors = useWatchHasErrors(CHILD_FIELDS)

  const cellVoltageFieldsValid = useWatchValidSchema(cellVoltageFieldsSchema)
  const controllerBatteryFieldsValid = useWatchValidSchema(controllerBatteryFieldsSchema)
  const cellInstallationDateFieldsValid = useWatchValidSchema(cellInstallationDateFields)

  return (
    <ChecklistSection
      title={scopedT('title')}
      subtitle={scopedT('subtitle')}
      completePercentage={completePercentage}
      hasErrors={hasErrors}
    >
      <ChecklistStep
        description={scopedT('check_controller_battery_step')}
        name="check_controller_battery"
        control={form.control}
        disabled={!controllerBatteryFieldsValid}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      >
        <NumberWithUnitsField
          label={scopedT('internal_battery_voltage_field.label')}
          units="V"
          name="internal_battery_volts_field"
          control={form.control}
        />
        <NumberWithUnitsField
          label={scopedT('external_battery_voltage_field.label')}
          units="V"
          name="external_battery_volts_field"
          control={form.control}
        />
      </ChecklistStep>
      <ChecklistStep
        description={scopedT('check_oxygen_cells_voltage_step')}
        name="check_oxygen_cells_voltage"
        control={form.control}
        disabled={!cellVoltageFieldsValid}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      >
        <NumberWithUnitsField
          label={scopedT('cell_one_voltage_field.label')}
          units="mV"
          name="cell_one_millivolts_field"
          control={form.control}
        />
        <NumberWithUnitsField
          label={scopedT('cell_two_voltage_field.label')}
          units="mV"
          name="cell_two_millivolts_field"
          control={form.control}
        />
        <NumberWithUnitsField
          label={scopedT('cell_three_voltage_field.label')}
          units="mV"
          name="cell_three_millivolts_field"
          control={form.control}
        />
      </ChecklistStep>
      <ChecklistStep
        description={scopedT('check_oxygen_cells_installation_date_step')}
        name="check_oxygen_cells_installation_date"
        control={form.control}
        disabled={!cellInstallationDateFieldsValid}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      >
        <OxygenCellInstallationDateField
          label={scopedT('cell_one_date_field.label')}
          placeholder={scopedT('cell_one_date_field.placeholder')}
          name="cell_one_installation_date_field"
          control={form.control}
        />
        <OxygenCellInstallationDateField
          label={scopedT('cell_two_date_field.label')}
          placeholder={scopedT('cell_two_date_field.placeholder')}
          name="cell_two_installation_date_field"
          control={form.control}
        />
        <OxygenCellInstallationDateField
          label={scopedT('cell_three_date_field.label')}
          placeholder={scopedT('cell_three_date_field.placeholder')}
          name="cell_three_installation_date_field"
          control={form.control}
        />
      </ChecklistStep>
      <ChecklistStep
        description={scopedT('check_dive_parameters_step')}
        name="check_dive_parameters"
        control={form.control}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      />
    </ChecklistSection>
  );
}
