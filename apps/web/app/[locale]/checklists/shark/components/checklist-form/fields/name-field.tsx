"use client"

import * as React from "react";
import {User} from "lucide-react";

import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useScopedI18n} from "@/locales/client";

export function NameField() {
  const t = useScopedI18n("rebreather_checklists.shark.full_name_field")

  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor="full-name">{t('label')}</Label>
      <div className="relative">
        <User className="absolute left-4 top-3 h-4 w-4"/>
        <Input type="text" id="full-name" placeholder={t('placeholder')} className="pl-8"/>
      </div>
    </div>
  );
}
