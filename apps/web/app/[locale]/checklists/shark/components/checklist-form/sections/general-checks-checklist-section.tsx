"use client"

import * as React from "react";

import {useFormContext} from "react-hook-form";

import type {FormValues} from "../schema";
import {useWatchTruthyFieldsPercentage} from "../hooks/use-watch-truthy-fields-percentage";

import {ChecklistSection} from "../checklist-section";
import {ChecklistStep} from "../checklist-step";
import {useScopedI18n} from "@/locales/client";

export function GeneralChecksChecklistSection() {
  const t = useScopedI18n("rebreather_checklists.shark.general_checks_section")
  const form = useFormContext<FormValues>()
  const completePercentage = useWatchTruthyFieldsPercentage([
    'check_dive_gases_and_sorbent_time',
    'check_dive_computer_connection',
    'check_dive_gear'
  ])

  return (
    <ChecklistSection
      title={t('title')}
      subtitle={t('subtitle')}
      completePercentage={completePercentage}
    >
      <ChecklistStep
        description={t('check_dive_gases_and_sorbent_time_step')}
        name="check_dive_gases_and_sorbent_time"
        control={form.control}
      />
      <ChecklistStep
        description={t('check_dive_computer_connection_step')}
        name="check_dive_computer_connection"
        control={form.control}
      />
      <ChecklistStep
        description={t('check_dive_gear_step')}
        name="check_dive_gear"
        control={form.control}
      />
    </ChecklistSection>
  )
}
