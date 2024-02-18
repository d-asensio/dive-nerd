"use client"

import * as React from "react";

import {useFormContext} from "react-hook-form";

import type {FormValues} from "../schema";

import {ChecklistSection} from "../checklist-section";
import {ChecklistStep} from "../checklist-step";

export function GeneralChecksChecklistSection() {
  const form = useFormContext<FormValues>()

  return (
    <ChecklistSection
      title="Comprobaciones generales"
      subtitle="Let's get ready to dive"
    >
      <ChecklistStep
        description="Lista de gases para el buceo, tiempo restante de cal"
        name="check_dive_gases_and_sorbent_time"
        control={form.control}
      />
      <ChecklistStep
        description="Conectar ordenador"
        name="check_dive_computer_connection"
        control={form.control}
      />
      <ChecklistStep
        description="Control de material para el buceo"
        name="check_dive_gear"
        control={form.control}
      />
    </ChecklistSection>
  )
}
