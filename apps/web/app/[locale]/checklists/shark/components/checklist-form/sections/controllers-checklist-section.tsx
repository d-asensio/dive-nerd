"use client"

import type {FormValues} from "../schema";
import * as React from "react";
import {useFormContext} from "react-hook-form";
import {z} from "zod";

import {useScopedI18n} from "@/locales/client";

import {useWatchTruthyFieldsPercentage} from "../hooks/use-watch-truthy-fields-percentage";

import {ChecklistSection} from "../checklist-section";
import {ChecklistStep} from "../checklist-step";

import {OxygenCellMillivoltsField} from "../fields/oxygen-cell-millivolts-field";
import {OxygenCellInstallationDateField} from "../fields/oxygen-cell-installation-date-field";
import {BatteryVoltsField} from "../fields/battery-volts-field";
import {useWatchHasErrors} from "../hooks/use-watch-has-errors";
import {useWatchValidSchema} from "../hooks/use-watch-valid-schema";

const CHILD_FIELDS = [
  'check_controller_battery',
  'check_oxygen_cells_voltage',
  'check_oxygen_cells_installation_date',
  'check_dive_parameters'
]

export const sectionStepsSchema = z.object({
  check_controller_battery: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.controllers_section.check_controller_battery_step.error.is_required"
    })
  }),
  check_oxygen_cells_voltage: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.controllers_section.check_oxygen_cells_voltage_step.error.is_required"
    })
  }),
  check_oxygen_cells_installation_date: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.controllers_section.check_oxygen_cells_installation_date_step.error.is_required"
    })
  }),
  check_dive_parameters: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.controllers_section.check_dive_parameters_step.error.is_required"
    })
  }),
})

export const cellVoltageFieldsSchema = z.object({
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

export const controllerBatteryFieldsSchema = z.object({
  internal_battery_volts_field: z.coerce.number()
    .gt(0, {
      message: "rebreather_checklists.shark.controllers_section.internal_battery_voltage_field.error.is_too_low"
    }),
  external_battery_volts_field: z.coerce.number()
    .gt(0, {
      message: "rebreather_checklists.shark.controllers_section.external_battery_voltage_field.error.is_too_low"
    }),
})

export const cellInstallationDateFields = z.object({
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

export function ControllersChecklistSection() {
  const t = useScopedI18n("rebreather_checklists.shark.controllers_section")
  const form = useFormContext<FormValues>()
  const completePercentage = useWatchTruthyFieldsPercentage(CHILD_FIELDS)
  const hasErrors = useWatchHasErrors(CHILD_FIELDS)

  const cellVoltageFieldsValid = useWatchValidSchema(cellVoltageFieldsSchema)
  const controllerBatteryFieldsValid = useWatchValidSchema(controllerBatteryFieldsSchema)
  const cellInstallationDateFieldsValid = useWatchValidSchema(cellInstallationDateFields)

  return (
    <ChecklistSection
      title={t('title')}
      subtitle={t('subtitle')}
      completePercentage={completePercentage}
      hasErrors={hasErrors}
    >
      <ChecklistStep
        description={t('check_controller_battery_step')}
        name="check_controller_battery"
        control={form.control}
        disabled={!controllerBatteryFieldsValid}
      >
        <BatteryVoltsField
          label={t('internal_battery_voltage_field.label')}
          name="internal_battery_volts_field"
          control={form.control}
        />
        <BatteryVoltsField
          label={t('external_battery_voltage_field.label')}
          name="external_battery_volts_field"
          control={form.control}
        />
      </ChecklistStep>
      <ChecklistStep
        description={t('check_oxygen_cells_voltage_step')}
        name="check_oxygen_cells_voltage"
        control={form.control}
        disabled={!cellVoltageFieldsValid}
      >
        <OxygenCellMillivoltsField
          label={t('cell_one_voltage_field.label')}
          name="cell_one_millivolts_field"
          control={form.control}
        />
        <OxygenCellMillivoltsField
          label={t('cell_two_voltage_field.label')}
          name="cell_two_millivolts_field"
          control={form.control}
        />
        <OxygenCellMillivoltsField
          label={t('cell_three_voltage_field.label')}
          name="cell_three_millivolts_field"
          control={form.control}
        />
      </ChecklistStep>
      <ChecklistStep
        description={t('check_oxygen_cells_installation_date_step')}
        name="check_oxygen_cells_installation_date"
        control={form.control}
        disabled={!cellInstallationDateFieldsValid}
      >
        <OxygenCellInstallationDateField
          label={t('cell_one_date_field.label')}
          placeholder={t('cell_one_date_field.placeholder')}
          name="cell_one_installation_date_field"
          control={form.control}
        />
        <OxygenCellInstallationDateField
          label={t('cell_two_date_field.label')}
          placeholder={t('cell_two_date_field.placeholder')}
          name="cell_two_installation_date_field"
          control={form.control}
        />
        <OxygenCellInstallationDateField
          label={t('cell_three_date_field.label')}
          placeholder={t('cell_three_date_field.placeholder')}
          name="cell_three_installation_date_field"
          control={form.control}
        />
      </ChecklistStep>
      <ChecklistStep
        description={t('check_dive_parameters_step')}
        name="check_dive_parameters"
        control={form.control}
      />
    </ChecklistSection>
  );
}
