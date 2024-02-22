"use client"

import type {FieldErrors} from "react-hook-form";
import * as React from "react";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {toast} from "@/components/ui/use-toast";
import {Button} from "@/components/ui/button";

import {NameField} from "./fields/name-field";
import {DateField} from "./fields/date-field";

import {formSchema, FormValues} from "./schema";

import {ControllersChecklistSection} from "./sections/controllers-checklist-section";
import {GasChecklistSection} from "./sections/gas-checklist-section";
import {MontageChecklistSection} from "./sections/montage-checklist-section";
import {TightnessChecklistSection} from "./sections/tightness-checklist-section";
import {OxygenCalibrationChecklistSection} from "./sections/oxygen-calibration-checklist-section";
import {DiluentCalibrationChecklistSection} from "./sections/diluent-calibration-checklist-section";
import {BailoutChecklistSection} from "./sections/bailout-checklist-section";
import {GeneralChecksChecklistSection} from "./sections/general-checks-checklist-section";
import {useScopedI18n} from "@/locales/client";

export function ChecklistForm() {
  const t = useScopedI18n("rebreather_checklists.shark.confirmation")
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      internal_battery_volts_field: 0,
      external_battery_volts_field: 0,
      cell_one_millivolts_field: 0,
      cell_two_millivolts_field: 0,
      cell_three_millivolts_field: 0,
      carbon_dioxide_absorbent_remaining_time_field: 0,
      oxygen_percentage_reading_field: 0,
      oxygen_pressure_field: 0,
      diluent_percentage_reading_field: 0,
      diluent_pressure_field: 0
    }
  })

  function onSubmitValid(data: FormValues) {
    console.log(data)
    toast({
      title: t('success_toast.title'),
    })
  }

  function onSubmitInvalid(errors: FieldErrors) {
    console.log(errors)
    toast({
      title: t('fail_toast.title'),
      description: t('fail_toast.description'),
      variant: "destructive"
    })
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmitValid, onSubmitInvalid)}>
        <div className="w-full p-6 grid gap-4 sm:grid-cols-2">
          <NameField/>
          <DateField/>
        </div>
        <div className='mb-4'>
          <ControllersChecklistSection/>
          <GasChecklistSection/>
          <MontageChecklistSection/>
          <TightnessChecklistSection/>
          <OxygenCalibrationChecklistSection/>
          <DiluentCalibrationChecklistSection/>
          <BailoutChecklistSection/>
          <GeneralChecksChecklistSection/>
        </div>
        <div className="flex justify-end w-full p-6">
          <Button type="submit">
            {t('button')}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
