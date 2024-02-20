"use client"

import * as React from "react";

import {useFormContext} from "react-hook-form";

import type {FormValues} from "../schema";
import {useWatchTruthyFieldsPercentage} from "../hooks/use-watch-truthy-fields-percentage";

import {ChecklistSection} from "../checklist-section";
import {ChecklistStep} from "../checklist-step";

import {GasOxygenPercentageField} from "../fields/gas-oxygen-percentage-field";
import {TankPressureField} from "../fields/tank-pressure-field";
import {useScopedI18n} from "@/locales/client";

export function GasChecklistSection() {
  const t = useScopedI18n("rebreather_checklists.shark.gas_section")
  const form = useFormContext<FormValues>()
  const completePercentage = useWatchTruthyFieldsPercentage([
    'check_oxygen_percentage_and_pressure',
    'check_diluent_percentage_and_pressure'
  ])

  return (
    <ChecklistSection
      title={t('title')}
      subtitle={t('subtitle')}
      completePercentage={completePercentage}
    >
      <ChecklistStep
        name="check_oxygen_percentage_and_pressure"
        description={t('check_oxygen_percentage_and_pressure_step')}
        control={form.control}
      >
        <GasOxygenPercentageField
          name='oxygen_percentage_reading_field'
          label={t('oxygen_percentage_reading_field.label')}
        />
        <TankPressureField
          name='oxygen_pressure_field'
          label={t('oxygen_pressure_field.label')}
        />
      </ChecklistStep>
      <ChecklistStep
        description={t('check_diluent_percentage_and_pressure_step')}
        name="check_diluent_percentage_and_pressure"
        control={form.control}
      >
        <GasOxygenPercentageField
          name='diluent_percentage_reading_field'
          label={t('diluent_percentage_reading_field.label')}
        />
        <TankPressureField
          name='diluent_pressure_field'
          label={t('diluent_pressure_field.label')}
        />
      </ChecklistStep>
    </ChecklistSection>
  )
}
