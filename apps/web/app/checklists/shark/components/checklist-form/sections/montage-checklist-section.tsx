"use client"

import * as React from "react";

import {useFormContext} from "react-hook-form";

import type {FormValues} from "../schema";
import {useWatchTruthyFieldsPercentage} from "../hooks/use-watch-truthy-fields-percentage";

import {ChecklistSection} from "../checklist-section";
import {ChecklistStep} from "../checklist-step";

import {MinutesField} from "../fields/minutes-field";


export function MontageChecklistSection() {
  const form = useFormContext<FormValues>()
  const completePercentage = useWatchTruthyFieldsPercentage([
    'check_carbon_dioxide_absorbent_remaining_time',
    'install_diluent_and_oxygen_tanks',
    'install_water_trap_and_cannister',
    'check_canister_head_grommets',
    'install_counterlungs',
    'install_head_connectors_and_hoses',
    'check_breathing_hoses_stereo',
    'check_breathing_hoses_grommets',
    'install_heads_up_display_cable',
    'check_negative_test'
  ])

  return (
    <ChecklistSection
      title="Montaje rebreather"
      subtitle="Putting it altoghether"
      completePercentage={completePercentage}
    >
      <ChecklistStep
        description="Tiempo restante de la vida de la cal reemplazar si es necesario"
        name="check_carbon_dioxide_absorbent_remaining_time"
        control={form.control}
      >
        <MinutesField
          name="carbon_dioxide_absorbent_remaining_time_field"
          label="Tiempo restante"
        />
      </ChecklistStep>
      <ChecklistStep
        description="Instalar las botellas en la unidad y colocar los pasadores"
        name="install_diluent_and_oxygen_tanks"
        control={form.control}
      />
      <ChecklistStep
        description="Instalar el soporte (trampa de agua) e introducir el canister dentro del tubo"
        name="install_water_trap_and_cannister"
        control={form.control}
      />
      <ChecklistStep
        description="Revisar las toricas y piezas del cabezal, engrasar con grasa compatible O2 y montar el cabezal"
        name="check_canister_head_grommets"
        control={form.control}
      />
      <ChecklistStep
        description="Instalar contrapulmones y asegurarnos que quedan fijados (clack)"
        name="install_counterlungs"
        control={form.control}
      />
      <ChecklistStep
        description="Instalar soporte de la tapa de los contrapulmones"
        name="install_counterlungs_cover"
        control={form.control}
      />
      <ChecklistStep
        description="Instalar conectores electricos de los controladores y conectar latiguillos de ADV, MAV O2 y MAV DIL"
        name="install_head_connectors_and_hoses"
        control={form.control}
      />
      <ChecklistStep
        description="Revisar traqueas y hacer prueba estereo (mirar las dos direcciones del gas)"
        name="check_breathing_hoses_stereo"
        control={form.control}
      />
      <ChecklistStep
        description="Revisar tóricas de las tráqueas"
        name="check_breathing_hoses_grommets"
        control={form.control}
      />
      <ChecklistStep
        description="Colocar cable HUD a la tráquea"
        name="install_heads_up_display_cable"
        control={form.control}
      />
      <ChecklistStep
        description="Realizar test negativo"
        name="check_negative_test"
        control={form.control}
      />
    </ChecklistSection>
  )
}
