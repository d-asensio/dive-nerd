"use client"

import type {PropsWithChildren} from "react";
import type {ControllerProps, FieldPath, FieldValues} from "react-hook-form";
import * as React from "react";

import {cn} from "@/lib/utils";

import {Switch} from "@/components/ui/switch";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import {Label} from "@/components/ui/label";

type ChecklistStepProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Pick<ControllerProps<TFieldValues, TName>, "name" | "control"> & PropsWithChildren<{
  description: string
}>

export function ChecklistStep<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({name, description, control, children, ...rest}: ChecklistStepProps<TFieldValues, TName>) {
  return (
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <div
            className={cn(
              "p-4 space-y-4 transition-colors",
              field.value && "bg-green-50",
              fieldState.error && "bg-red-50"
            )}
          >
            <FormItem className="flex items-center justify-between space-x-2">
              <div className="flex flex-col">
                <Label className="text-base">{description}</Label>
                <FormMessage />
              </div>
              <FormControl>
                <Switch
                  ref={field.ref}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
            {children && (
              <div
                className="rounded-lg bg-gray-200 px-6 py-4 flex items-start gap-3 flex-wrap">
                {children}
              </div>
            )}
          </div>
        )}
      />
  );
}
