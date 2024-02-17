import * as React from "react";

import {cn} from "@/lib/utils";

import {Input, InputProps} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";

interface InputWithUnitsProps extends Omit<InputProps, "decorator"> {
  units: string
}

export const InputWithUnits = React.forwardRef<HTMLInputElement, InputWithUnitsProps>(
  ({units, ...props}, ref) => (
    <Input
      ref={ref}
      decorator={
        <>
          <Separator orientation={"vertical"}/>
          <span
            className={cn(
              "p-2 min-w-[40px] w-auto border-l-0 rounded-l-none text-center text-muted-foreground select-none whitespace-nowrap"
            )}
          >
          {units}
        </span>
        </>
      }
      {...props}
    />
  )
)

InputWithUnits.displayName = "InputWithUnits"
