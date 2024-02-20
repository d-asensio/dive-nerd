"use client"

import * as React from "react";
import {Calendar as CalendarIcon} from "lucide-react";
import {format} from "date-fns";

import {cn} from "@/lib/utils";

import {Label} from "@/components/ui/label";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {useScopedI18n} from "@/locales/client";

export function DateField() {
  const t = useScopedI18n("rebreather_checklists.shark.date_field")
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="grid w-full items-center gap-1.5">
      <Label>{t('label')}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-4 h-4 w-4"/>
            {date ? format(date, "PPP") : <span>{t('placeholder')}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
