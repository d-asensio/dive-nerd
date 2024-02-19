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
      <SelectTrigger>
        <SelectValue/>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">
          English
        </SelectItem>
        <SelectItem value="es">
          Spanish
        </SelectItem>
        <SelectItem value="ca">
          Catalan
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
