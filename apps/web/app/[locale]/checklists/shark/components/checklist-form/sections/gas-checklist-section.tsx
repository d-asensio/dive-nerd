"use client"

import * as React from "react";

import {useFormContext} from "react-hook-form";

import type {FormValues} from "../schema";
import {useWatchTruthyFieldsPercentage} from "../hooks/use-watch-truthy-fields-percentage";

import {ChecklistSection} from "../checklist-section";
import {ChecklistStep} from "../checklist-step";

import {GasOxygenPercentageField} from "../fields/gas-oxygen-percentage-field";
import {TankPressureField} from "../fields/tank-pressure-field";

export function GasChecklistSection() {
  const form = useFormContext<FormValues>()
  const completePercentage = useWatchTruthyFieldsPercentage([
    'check_oxygen_percentage_and_pressure',
    'check_diluent_percentage_and_pressure'
  ])

  return (
    <ChecklistSection
      title="Gas"
      subtitle="Always know what you breath"
      completePercentage={completePercentage}
    >
      <ChecklistStep
        name="check_oxygen_percentage_and_pressure"
        description="Análisis y presión de la botella de oxígeno"
        control={form.control}
      >
        <GasOxygenPercentageField
          name='oxygen-percentage-reading-field'
          label="Análisis"
        />
        <TankPressureField
          name='oxygen-pressure-field'
          label="Presión"
        />
      </ChecklistStep>
      <ChecklistStep
        description="Analisis y presión de la botella de diluyente"
        name="check_diluent_percentage_and_pressure"
        control={form.control}
      >
        <GasOxygenPercentageField
          name='diluent-percentage-reading-field'
          label="Análisis"
        />
        <TankPressureField
          name='diluent-pressure-field'
          label="Presión"
        />
      </ChecklistStep>
    </ChecklistSection>
  )
}
