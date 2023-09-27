import * as React from "react";

import {cn} from "@/lib/utils";

import {Input, InputProps} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";

interface InputWithUnitsProps extends Omit<InputProps, "decorator"> {
  units: string
}

export const InputWithUnits = ({units, ...props}: InputWithUnitsProps) => (
  <Input
    decorator={
      <>
        <Separator orientation={"vertical"}/>
        <span
          className={cn(
            "flex p-2 items-center w-auto border-l-0 rounded-l-none text-muted-foreground select-none whitespace-nowrap"
          )}
        >
          {units}
        </span>
      </>
    }
    {...props}
  />
)