import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import * as React from "react";
import {PropsWithChildren} from "react";

type ChecklistStepProps = PropsWithChildren<{
  id: string,
  description: string
}>

export function ChecklistStep({id, description, children}: ChecklistStepProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor={id}>
          {description}
        </Label>
        <Switch id={id}/>
      </div>
      {children && (
        <div className="rounded-lg bg-accent px-6 py-4 flex items-start gap-3 flex-wrap">
          {children}
        </div>
      )}
    </div>
  );
}
