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
import {useI18n} from "@/locales/client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";

type ChecklistStepProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> =
  Pick<ControllerProps<TFieldValues, TName>, "name" | "control">
  & PropsWithChildren<{
  description: string
  disabled?: boolean
}>

export function ChecklistStep<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    name,
    description,
    control,
    children,
    disabled
  }: ChecklistStepProps<TFieldValues, TName>) {
  const t = useI18n()
  return (
    <FormField
      control={control}
      name={name}
      render={({field, fieldState}) => (
        <Collapsible open={!field.value}>
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
                {fieldState.error && (
                  <div className="text-sm font-medium text-destructive">
                    {t(
                      // @ts-ignore
                      fieldState.error.message
                    )}
                  </div>
                )}
              </div>
              <FormControl>
                <Switch
                  ref={field.ref}
                  checked={field.value}
                  disabled={disabled}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
            {children && (
              <CollapsibleContent>
                <div
                  className="rounded-lg bg-gray-200 px-6 py-4 grid items-start sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
                  {children}
                </div>
              </CollapsibleContent>
            )}
          </div>
        </Collapsible>
      )}
    />
  );
}
