import * as React from "react";

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export const LanguageSelector = () => {
  return (
    <Select defaultValue="en-US">
      <SelectTrigger>
        <SelectValue/>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en-US">
          English
        </SelectItem>
        <SelectItem value="es-ES">
          Spanish
        </SelectItem>
        <SelectItem value="ca-ES">
          Catalan
        </SelectItem>
      </SelectContent>
    </Select>
  )
}