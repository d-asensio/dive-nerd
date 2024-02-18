"use client"

import * as React from "react";

import {useFormContext} from "react-hook-form";

import type {FormValues} from "../schema";

import {ChecklistSection} from "../checklist-section";
import {ChecklistStep} from "../checklist-step";

import {GasOxygenPercentageField} from "../fields/gas-oxygen-percentage-field";
import {TankPressureField} from "../fields/tank-pressure-field";

export function GasChecklistSection() {
  const form = useFormContext<FormValues>()

  return (
    <ChecklistSection
      title="Gas"
      subtitle="Always know what you breath"
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
