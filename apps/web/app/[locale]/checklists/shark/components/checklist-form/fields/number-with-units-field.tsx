"use client"

import type {ControllerProps, FieldPath, FieldValues} from "react-hook-form";
import * as React from "react";

import {InputWithUnits} from "@/components/app/input-with-units";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {useI18n} from "@/locales/client";

type OxygenCellMillivoltsFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Pick<ControllerProps<TFieldValues, TName>, "name" | "control"> & {
  label: string
  units: string
}

export function NumberWithUnitsField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ label, name, units, control }: OxygenCellMillivoltsFieldProps<TFieldValues, TName>) {
  const t = useI18n()
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <InputWithUnits
              id={name}
              units={units}
              type="number"
              min={0}
              step={1}
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
