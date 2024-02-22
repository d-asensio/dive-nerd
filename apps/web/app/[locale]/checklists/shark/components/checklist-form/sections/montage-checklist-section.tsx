"use client"

import type {FormValues} from "../schema";
import * as React from "react";

import {z} from "zod";
import {useFormContext} from "react-hook-form";

import {useI18n, useScopedI18n} from "@/locales/client";

import {useWatchTruthyFieldsPercentage} from "../hooks/use-watch-truthy-fields-percentage";
import {useWatchHasErrors} from "../hooks/use-watch-has-errors";

import {ChecklistSection} from "../checklist-section";
import {ChecklistStep} from "../checklist-step";

import {NumberWithUnitsField} from "../fields/number-with-units-field";

const CHILD_FIELDS = [
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
]

const sectionStepsSchema = z.object({
  check_carbon_dioxide_absorbent_remaining_time: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  install_diluent_and_oxygen_tanks: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  install_water_trap_and_cannister: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_canister_head_grommets: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  install_counterlungs: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  install_counterlungs_cover: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  install_head_connectors_and_hoses: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_breathing_hoses_stereo: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_breathing_hoses_grommets: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  install_heads_up_display_cable: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_negative_test: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
})

const co2AbsorbentRemainingTimeFields = z.object({
  carbon_dioxide_absorbent_remaining_time_field: z.coerce.number()
})

export const montageSectionSchema = z.object({
  ...sectionStepsSchema.shape,
  ...co2AbsorbentRemainingTimeFields.shape,
})

export function MontageChecklistSection() {
  const t = useI18n()
  const scopedT = useScopedI18n("rebreather_checklists.shark.montage_section")
  const form = useFormContext<FormValues>()

  const completePercentage = useWatchTruthyFieldsPercentage(CHILD_FIELDS)
  const hasErrors = useWatchHasErrors(CHILD_FIELDS)

  return (
    <ChecklistSection
      title={scopedT('title')}
      subtitle={scopedT('subtitle')}
      completePercentage={completePercentage}
      hasErrors={hasErrors}
    >
      <ChecklistStep
        description={scopedT('check_carbon_dioxide_absorbent_remaining_time_step')}
        name="check_carbon_dioxide_absorbent_remaining_time"
        control={form.control}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      >
        <NumberWithUnitsField
          label={scopedT('carbon_dioxide_absorbent_remaining_time_field.label')}
          units={scopedT('carbon_dioxide_absorbent_remaining_time_field.units')}
          name="carbon_dioxide_absorbent_remaining_time_field"
          control={form.control}
        />
      </ChecklistStep>
      <ChecklistStep
        description={scopedT('install_diluent_and_oxygen_tanks_step')}
        name="install_diluent_and_oxygen_tanks"
        control={form.control}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      />
      <ChecklistStep
        description={scopedT('install_water_trap_and_cannister_step')}
        name="install_water_trap_and_cannister"
        control={form.control}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      />
      <ChecklistStep
        description={scopedT('check_canister_head_grommets_step')}
        name="check_canister_head_grommets"
        control={form.control}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      />
      <ChecklistStep
        description={scopedT('install_counterlungs_step')}
        name="install_counterlungs"
        control={form.control}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      />
      <ChecklistStep
        description={scopedT('install_counterlungs_cover_step')}
        name="install_counterlungs_cover"
        control={form.control}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      />
      <ChecklistStep
        description={scopedT('install_head_connectors_and_hoses_step')}
        name="install_head_connectors_and_hoses"
        control={form.control}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      />
      <ChecklistStep
        description={scopedT('check_breathing_hoses_stereo_step')}
        name="check_breathing_hoses_stereo"
        control={form.control}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      />
      <ChecklistStep
        description={scopedT('check_breathing_hoses_grommets_step')}
        name="check_breathing_hoses_grommets"
        control={form.control}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      />
      <ChecklistStep
        description={scopedT('install_heads_up_display_cable_step')}
        name="install_heads_up_display_cable"
        control={form.control}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      />
      <ChecklistStep
        description={scopedT('check_negative_test_step')}
        name="check_negative_test"
        control={form.control}
        disabledExplanation={t('rebreather_checklists.steps.error.is_disabled')}
      />
    </ChecklistSection>
  )
}
