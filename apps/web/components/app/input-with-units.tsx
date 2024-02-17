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
          <div
            className="p-2 min-w-[40px] w-auto border-l rounded-l-none text-center text-muted-foreground select-none whitespace-nowrap"
          >
            {units}
          </div>
      }
      {...props}
    />
  )
)

InputWithUnits.displayName = "InputWithUnits"
