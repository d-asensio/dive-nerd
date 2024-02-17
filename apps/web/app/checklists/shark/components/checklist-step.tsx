import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import * as React from "react";
import {PropsWithChildren} from "react";

type ChecklistStepProps = PropsWithChildren<{
  id: string,
  description: string
}>

export function ChecklistStep({id, description}: ChecklistStepProps) {
  return (
    <div className="flex items-center justify-between space-x-2">
      <Label htmlFor={id}>
        {description}
      </Label>
      <Switch id={id}/>
    </div>
  );
}
