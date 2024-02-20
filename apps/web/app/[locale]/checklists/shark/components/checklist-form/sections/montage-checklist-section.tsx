"use client"

import * as React from "react";

import {useFormContext} from "react-hook-form";

import type {FormValues} from "../schema";
import {useWatchTruthyFieldsPercentage} from "../hooks/use-watch-truthy-fields-percentage";

import {ChecklistSection} from "../checklist-section";
import {ChecklistStep} from "../checklist-step";

import {MinutesField} from "../fields/minutes-field";
import {useScopedI18n} from "@/locales/client";


export function MontageChecklistSection() {
  const t = useScopedI18n("rebreather_checklists.shark.montage_section")
  const form = useFormContext<FormValues>()
  const completePercentage = useWatchTruthyFieldsPercentage([
    'check_carbon_dioxide_absorbent_remaining_time',
    'install_diluent_and_oxygen_tanks',
    'install_water_trap_and_cannister',
    'check_canister_head_grommets',
    'install_counterlungs',
    'install_counterlungs_cover',
    'install_head_connectors_and_hoses',
    'check_breathing_hoses_stereo',
    'check_breathing_hoses_grommets',
    'install_heads_up_display_cable',
    'check_negative_test'
  ])

  return (
    <ChecklistSection
      title={t('title')}
      subtitle={t('subtitle')}
      completePercentage={completePercentage}
    >
      <ChecklistStep
        description={t('check_carbon_dioxide_absorbent_remaining_time_step')}
        name="check_carbon_dioxide_absorbent_remaining_time"
        control={form.control}
      >
        <MinutesField
          name="carbon_dioxide_absorbent_remaining_time_field"
          label={t('carbon_dioxide_absorbent_remaining_time_field.label')}
          units={t('carbon_dioxide_absorbent_remaining_time_field.units')}
        />
      </ChecklistStep>
      <ChecklistStep
        description={t('install_diluent_and_oxygen_tanks_step')}
        name="install_diluent_and_oxygen_tanks"
        control={form.control}
      />
      <ChecklistStep
        description={t('install_water_trap_and_cannister_step')}
        name="install_water_trap_and_cannister"
        control={form.control}
      />
      <ChecklistStep
        description={t('check_canister_head_grommets_step')}
        name="check_canister_head_grommets"
        control={form.control}
      />
      <ChecklistStep
        description={t('install_counterlungs_step')}
        name="install_counterlungs"
        control={form.control}
      />
      <ChecklistStep
        description={t('install_counterlungs_cover_step')}
        name="install_counterlungs_cover"
        control={form.control}
      />
      <ChecklistStep
        description={t('install_head_connectors_and_hoses_step')}
        name="install_head_connectors_and_hoses"
        control={form.control}
      />
      <ChecklistStep
        description={t('check_breathing_hoses_stereo_step')}
        name="check_breathing_hoses_stereo"
        control={form.control}
      />
      <ChecklistStep
        description={t('check_breathing_hoses_grommets_step')}
        name="check_breathing_hoses_grommets"
        control={form.control}
      />
      <ChecklistStep
        description={t('install_heads_up_display_cable_step')}
        name="install_heads_up_display_cable"
        control={form.control}
      />
      <ChecklistStep
        description={t('check_negative_test_step')}
        name="check_negative_test"
        control={form.control}
      />
    </ChecklistSection>
  )
}
