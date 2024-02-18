"use client"

import type {PropsWithChildren} from "react";
import * as React from "react";
import {CheckCircle2} from "lucide-react";

type ChecklistSectionProps = PropsWithChildren<{
  title: string,
  subtitle: string,
  completePercentage?: number
}>

export function ChecklistSection({ title, subtitle, completePercentage = 0, children }: ChecklistSectionProps) {
  const isComplete = completePercentage === 1
  const complementaryPercentage = Math.round((1-completePercentage) * 100)

  return (
    <div>
      <div className="sticky top-0 bg-background z-10 border-t">
        <div className="w-full relative border-b p-4 overflow-hidden">
          <div
            className="bg-green-100 absolute left-0 top-0 h-full w-full -z-10 transition-transform ease-in-out"
            style={{
              transform: `translateX(-${complementaryPercentage}%)`
            }}
          />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-medium leading-none">
                {title}
              </h4>
              <p className="text-sm text-muted-foreground">
                {subtitle}
              </p>
            </div>
            {isComplete && <CheckCircle2 className="h-6 w-6 text-green-600 animate-in zoom-in"/>}
          </div>
        </div>
      </div>
      <div className="p-4 space-y-6">
        {children}
      </div>
    </div>
  );
}
