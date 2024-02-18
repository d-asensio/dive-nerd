"use client"

import * as React from "react";

import {useFormContext} from "react-hook-form";

import type {FormValues} from "../schema";

import {ChecklistSection} from "../checklist-section";
import {ChecklistStep} from "../checklist-step";

export function DiluentCalibrationChecklistSection() {
  const form = useFormContext<FormValues>()

  return (
    <ChecklistSection
      title="Comprobar y calibrar diluyente"
      subtitle="Know what you breath"
    >
      <ChecklistStep
        description="Abrir diluyente, comprobar manómetro y adición manual"
        name="check_diluent_pressure_and_manual_addition"
        control={form.control}
      />
      <ChecklistStep
        description="Comprobar ADV si funciona e inflar ala al máximo"
        name="check_automatic_diluent_valve"
        control={form.control}
      />
      <ChecklistStep
        description="Limpiar circuito con diluyente, comprobar la ppO2 esta entre 0,20/0,22"
        name="check_diluent_flush"
        control={form.control}
      />
      <ChecklistStep
        description="Cerrar el diluyente y comprobar con el manómetro que no hay fugas"
        name="check_diluent_leakage"
        control={form.control}
      />
      <ChecklistStep
        description="Purgar el diluyente"
        name="check_diluent_purge"
        control={form.control}
      />
    </ChecklistSection>
  )
}
