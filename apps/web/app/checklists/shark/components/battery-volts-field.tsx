import * as React from "react";
import {ControllerProps, FieldPath, FieldValues} from "react-hook-form";

import {InputWithUnits} from "@/components/app/input-with-units";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

type BatteryVoltsFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Pick<ControllerProps<TFieldValues, TName>, "name" | "control"> & {
  label: string
}

export function BatteryVoltsField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ label, name, control }: BatteryVoltsFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
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
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
