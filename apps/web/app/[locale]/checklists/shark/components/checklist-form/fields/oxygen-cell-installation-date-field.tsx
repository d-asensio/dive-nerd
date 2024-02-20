"use client"

import type {ControllerProps, FieldPath, FieldValues} from "react-hook-form";
import * as React from "react";

import {format} from "date-fns"
import {CalendarIcon} from "lucide-react"

import {cn} from "@/lib/utils"

import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {useI18n} from "@/locales/client";

type OxygenCellInstallationDateFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Pick<ControllerProps<TFieldValues, TName>, "name" | "control"> & {
  label: string
  placeholder: string
}

export function OxygenCellInstallationDateField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ label, placeholder, name, control }: OxygenCellInstallationDateFieldProps<TFieldValues, TName>) {
  const t = useI18n()
  return (
    <FormField
      control={control}
      name={name}
      render={({field, fieldState: { error }}) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PP")
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
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
  )
}
