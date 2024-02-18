"use client"

import * as React from "react";

import {useFormContext} from "react-hook-form";

import type {FormValues} from "../schema";

import {ChecklistSection} from "../checklist-section";
import {ChecklistStep} from "../checklist-step";

export function OxygenCalibrationChecklistSection() {
  const form = useFormContext<FormValues>()

  return (
    <ChecklistSection
      title="Comprobar y calibrar oxigeno"
      subtitle="Know what you breath"
    >
      <ChecklistStep
        description="Encender el controlador Shearwater configurar setpoint a 0,7 ppO2 y encender el backup. Comprobar que ambos funcionan. Comprobar bateria interna y externa"
        name="check_main_and_backup_computers"
        control={form.control}
      />
      <ChecklistStep
        description="Abrir O2, comprobar presión manómetro y la adición manual"
        name="check_oxygen_pressure_and_manual_addition"
        control={form.control}
      />
      <ChecklistStep
        description="Llenar el circuito con O2 realizando 3 test negativos"
        name="check_oxygen_flush"
        control={form.control}
      />
      <ChecklistStep
        description="Calibrar controlador principal y secundario"
        name="check_main_and_backup_calibration"
        control={form.control}
      />
      <ChecklistStep
        description="Configurar setpoint a 0,19 ppO2"
        name="check_setpoint"
        control={form.control}
      />
      <ChecklistStep
        description="Cerrar O2, verificar manómetro y válvula flujo constante, mirar el tiempo que tarda en perder 10bar (control de la válvula de flujo constante)"
        name="check_constant_mass_valve"
        control={form.control}
      />
    </ChecklistSection>
  )
}
