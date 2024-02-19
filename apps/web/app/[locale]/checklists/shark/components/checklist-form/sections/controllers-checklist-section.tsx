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


export function ControllersChecklistSection() {
  const form = useFormContext<FormValues>()
  const completePercentage = useWatchTruthyFieldsPercentage([
    'check_controller_battery',
    'check_oxygen_cells_voltage',
    'check_oxygen_cells_installation_date',
    'check_dive_parameters'
  ])

  return (
    <ChecklistSection
      title="Controladores"
      subtitle="The rebreather brain"
      completePercentage={completePercentage}
    >
      <ChecklistStep
        description="Conectar controlador (Shearwater) y comprobar las baterías"
        name="check_controller_battery"
        control={form.control}
      >
        <BatteryVoltsField
          label="Batería interna"
          name="internal_battery_volts_field"
          control={form.control}
        />
        <BatteryVoltsField
          label="Batería externa"
          name="external_battery_volts_field"
          control={form.control}
        />
      </ChecklistStep>
      <ChecklistStep
        description="Voltaje de las célula de oxígeno en aire >9mv"
        name="check_oxygen_cells_voltage"
        control={form.control}
      >
        <OxygenCellMillivoltsField
          label="Célula 1"
          name="cell_one_millivolts_field"
          control={form.control}
        />
        <OxygenCellMillivoltsField
          label="Célula 2"
          name="cell_two_millivolts_field"
          control={form.control}
        />
        <OxygenCellMillivoltsField
          label="Célula 3"
          name="cell_three_millivolts_field"
          control={form.control}
        />
      </ChecklistStep>
      <ChecklistStep
        description="Comprobar fecha de instalación las células, máximo 6 meses y cambiar"
        name="check_oxygen_cells_installation_date"
        control={form.control}
      >
        <OxygenCellInstallationDateField
          label="Célula 1"
          name="cell_one_installation_date_field"
          control={form.control}
        />
        <OxygenCellInstallationDateField
          label="Célula 2"
          name="cell_two_installation_date_field"
          control={form.control}
        />
        <OxygenCellInstallationDateField
          label="Célula 3"
          name="cell_three_installation_date_field"
          control={form.control}
        />
      </ChecklistStep>
      <ChecklistStep
        description="Verificar los parametros de buceo"
        name="check_dive_parameters"
        control={form.control}
      />
    </ChecklistSection>
  );
}
