"use client"

import type {PropsWithChildren} from "react";
import * as React from "react";

import {Separator} from "@/components/ui/separator";

type ChecklistSectionProps = PropsWithChildren<{
  title: string,
  subtitle: string,
  completePercentage?: number
}>

export function ChecklistSection({ title, subtitle, completePercentage = 0, children }: ChecklistSectionProps) {
  return (
    <>
      <div className="sticky top-0 bg-background z-10 overflow-hidden">
        <div className="w-full relative">
          <div
            className="bg-green-100 absolute left-0 top-0 h-full w-full -z-10 transition-transform ease-in-out"
            style={{
              transform: `translateX(-${Math.round((1-completePercentage) * 100)}%)`
            }}
          />
          <Separator className="my-4"/>
          <div className="space-y-1 ml-4">
            <h4 className="text-sm font-medium leading-none">
              {title}
            </h4>
            <p className="text-sm text-muted-foreground">
              {subtitle}
            </p>
          </div>
          <Separator className="my-4"/>
        </div>
      </div>
      <div className="p-4 space-y-6">
        {children}
      </div>
    </>
  );
}
