"use client"

import type {PropsWithChildren} from "react";
import * as React from "react";
import {CheckCircle2, XCircle} from "lucide-react";
import {cn} from "@/lib/utils";

type ChecklistSectionProps = PropsWithChildren<{
  title: string,
  subtitle: string,
  completePercentage?: number
  hasErrors?: boolean
}>

export function ChecklistSection({ title, subtitle, hasErrors, completePercentage = 0, children }: ChecklistSectionProps) {
  const isComplete = completePercentage === 1
  const complementaryPercentage = Math.round((1-completePercentage) * 100)

  return (
    <div>
      <div className="sticky top-0 bg-background z-10">
        <div
          className={cn(
            "w-full relative border-t border-b p-4 overflow-hidden",
            isComplete ? 'border-green-200' : 'border-border',
            hasErrors && 'border-red-200'
          )}
        >
          {hasErrors && (
            <div
              className='bg-red-100 absolute left-0 top-0 h-full w-full -z-10'
            />
          )}
          <div
            className={cn(
              "absolute left-0 top-0 h-full w-full -z-10 transition-all ease-in-out",
              isComplete ? 'bg-green-200' : 'bg-green-100'
            )}
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
            {isComplete && <CheckCircle2
              className="h-6 w-6 text-green-600 animate-in zoom-in"/>}
            {hasErrors &&
              <XCircle className="h-6 w-6 text-red-600 animate-in zoom-in"/>}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
