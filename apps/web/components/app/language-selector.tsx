'use client'

import * as React from "react";

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { useChangeLocale, useCurrentLocale } from '@/locales/client'

export const LanguageSelector = () => {
  const changeLocale = useChangeLocale()
  const locale = useCurrentLocale()

  return (
    <Select
      value={locale}
      onValueChange={changeLocale}
    >
      <SelectTrigger className="w-[150px]">
        <SelectValue/>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">
          English
        </SelectItem>
        <SelectItem value="es">
          Español
        </SelectItem>
        <SelectItem value="ca">
          Català
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
