"use client"

import * as React from "react";
import {useFormContext} from "react-hook-form";

import type {FormValues} from "../schema";
import {useWatchTruthyFieldsPercentage} from "../hooks/use-watch-truthy-fields-percentage";

import {ChecklistSection} from "../checklist-section";
import {ChecklistStep} from "../checklist-step";

import {OxygenCellMillivoltsField} from "../fields/oxygen-cell-millivolts-field";
import {OxygenCellInstallationDateField} from "../fields/oxygen-cell-installation-date-field";
import {BatteryVoltsField} from "../fields/battery-volts-field";
import {useScopedI18n} from "@/locales/client";


export function ControllersChecklistSection() {
  const t = useScopedI18n("rebreather_checklists.shark.controllers_section")
  const form = useFormContext<FormValues>()
  const completePercentage = useWatchTruthyFieldsPercentage([
    'check_controller_battery',
    'check_oxygen_cells_voltage',
    'check_oxygen_cells_installation_date',
    'check_dive_parameters'
  ])

  return (
    <ChecklistSection
      title={t('title')}
      subtitle={t('subtitle')}
      completePercentage={completePercentage}
    >
      <ChecklistStep
        description={t('check_controller_battery_step')}
        name="check_controller_battery"
        control={form.control}
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
