"use client"

import * as React from "react";

import {Label} from "@/components/ui/label";
import {InputWithUnits} from "@/components/app/input-with-units";
import {useScopedI18n} from "@/locales/client";

interface MinutesFieldProps {
  name: string,
  label: string
  units: string
}

export function MinutesField({name, label, units}: MinutesFieldProps) {
  return (
    <div className="grid items-center gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <InputWithUnits
        id={name}
        units={units}
        type="number"
        min={0}
        step={1}
        className="w-[200px] min-w-[120px]"
      />
    </div>
  );
}
