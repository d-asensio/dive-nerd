import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import * as React from "react";

export function NameField() {
  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor="full-name">Full name</Label>
      <Input type="text" id="full-name" placeholder="Enter your full name..."/>
    </div>
  );
}
