"use client"

import * as React from "react";

import {useFormContext} from "react-hook-form";

import type {FormValues} from "../schema";
import {useWatchTruthyFieldsPercentage} from "../hooks/use-watch-truthy-fields-percentage";

import {ChecklistSection} from "../checklist-section";
import {ChecklistStep} from "../checklist-step";

export function TightnessChecklistSection() {
  const form = useFormContext<FormValues>()
  const completePercentage = useWatchTruthyFieldsPercentage([
    'check_negative_seal_test',
    'check_positive_seal_test',
    'check_mouthpiece_seal_test'
  ])

  return (
    <ChecklistSection
      title="Pruebas de estanqueidad"
      subtitle="Not a single leak"
      completePercentage={completePercentage}
    >
      <ChecklistStep
        description="Test negativo: Poner el equipo en presion negativa mirar si es estanco o no tiene fugas"
        name="check_negative_seal_test"
        control={form.control}
      />
      <ChecklistStep
        description="Test positivo: Dar presión al equipo, comprobar que la válvula de sobrepresión funciona y no tiene fugas"
        name="check_positive_seal_test"
        control={form.control}
      />
      <ChecklistStep
        description="Revisar la boquilla de la tráquea y que no tenga fugas"
        name="check_mouthpiece_seal_test"
        control={form.control}
      />
    </ChecklistSection>
  )
}
