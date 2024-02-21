'use client'

import * as React from "react";

import { useChangeLocale, useCurrentLocale } from '@/locales/client'
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";

export const LanguageSelector = () => {
  const changeLocale = useChangeLocale()
  const locale = useCurrentLocale()

  return (
    <DropdownMenuRadioGroup
      value={locale}
      onValueChange={(value: string) => changeLocale(value as "en" | "es" | "ca")}
    >
      <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="es">Español</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="ca">Català</DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  )
}
