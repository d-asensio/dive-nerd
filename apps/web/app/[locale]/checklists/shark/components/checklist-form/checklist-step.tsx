"use client"

import type {PropsWithChildren} from "react";
import type {ControllerProps, FieldPath, FieldValues} from "react-hook-form";
import * as React from "react";

import {cn} from "@/lib/utils";

import {Switch} from "@/components/ui/switch";
import {
  FormControl,
  FormField,
  FormItem
} from "@/components/ui/form";
import {Label} from "@/components/ui/label";
import {useI18n} from "@/locales/client";
import {
  Collapsible,
  CollapsibleContent
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TOOLTIP_OPEN_AUTO,
} from "@/components/ui/tooltip";

type ChecklistStepProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> =
  Pick<ControllerProps<TFieldValues, TName>, "name" | "control">
  & PropsWithChildren<{
  description: string
  disabledExplanation: string
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
    disabled,
    disabledExplanation
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
                <Tooltip delayDuration={300} open={disabled ? TOOLTIP_OPEN_AUTO : false}>
                  <TooltipTrigger asChild>
                    <div>
                      <Switch
                        ref={field.ref}
                        variant="success"
                        checked={field.value}
                        disabled={disabled}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={12} collisionPadding={12}>
                    <p>{disabledExplanation}</p>
                  </TooltipContent>
                </Tooltip>
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
