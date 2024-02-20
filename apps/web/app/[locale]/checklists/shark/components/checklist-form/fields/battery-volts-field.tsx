"use client"

import type {ControllerProps, FieldPath, FieldValues} from "react-hook-form";
import * as React from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {InputWithUnits} from "@/components/app/input-with-units";
import {useI18n, useScopedI18n} from "@/locales/client";

type BatteryVoltsFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Pick<ControllerProps<TFieldValues, TName>, "name" | "control"> & {
  label: string
}

export function BatteryVoltsField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({label, name, control}: BatteryVoltsFieldProps<TFieldValues, TName>) {
  const t = useI18n()
  return (
    <FormField
      control={control}
      name={name}
      render={({field, fieldState: { error }}) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <InputWithUnits
              id={name}
              units="V"
              type="number"
              min={0}
              step={0.1}
              className="w-[230px]"
              {...field}
            />
          </FormControl>
          {error && (
            <div className="text-sm font-medium text-destructive">
              {t(
                // @ts-ignore
                error.message
              )}
            </div>
          )}
        </FormItem>
      )}
    />
  );
}
