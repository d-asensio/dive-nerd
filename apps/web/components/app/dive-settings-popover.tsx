import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import {Settings} from "lucide-react";

import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";

import {InputWithUnits} from "@/components/app/input-with-units";

export function DiveSettingsPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px]" align="start">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">
              Dive settings
            </h4>
            <p className="text-sm text-muted-foreground">
              Set the parameters for the dive
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="descent_rate">Descent rate</Label>
              <InputWithUnits
                id="descent_rate"
                units="m/min"
                type="number"
                defaultValue="10"
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="maxWidth">Ascent rate</Label>
              <InputWithUnits
                id="ascent_rate"
                units="m/min"
                type="number"
                defaultValue="9"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
