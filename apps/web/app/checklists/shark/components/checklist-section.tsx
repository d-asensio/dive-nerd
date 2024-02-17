import * as React from "react";
import {PropsWithChildren} from "react";
import {Separator} from "@/components/ui/separator";

type ChecklistSectionProps = PropsWithChildren<{
  title: string,
  subtitle: string
}>

export function ChecklistSection({ title, subtitle, children }: ChecklistSectionProps) {
  return (
    <div>
      <Separator className="my-4"/>
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">
          {title}
        </h4>
        <p className="text-sm text-muted-foreground">
          {subtitle}
        </p>
      </div>
      <Separator className="my-4"/>
      <div className="p-4 space-y-6">
        {children}
      </div>
    </div>
  );
}
