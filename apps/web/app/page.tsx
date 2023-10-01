import * as React from "react";

import {DiveProfileChart} from "@/components/app/dive-profile-chart";
import {TopBar} from "@/components/app/top-bar";
import {DivePlanTable} from "@/components/app/dive-plan-table";
import {GasTable} from "@/components/app/gas-table";
import {DecompressionTable} from "@/components/app/decompression-table";
import {DiveSettingsPopover} from "@/components/app/dive-settings-popover";
import {
  CompartmentGasLoadChart
} from "@/components/app/compartment-gas-load-chart";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {ChevronsUpDown} from "lucide-react";
import {Button} from "@/components/ui/button";


export default function Home() {
  return (
    <main>
      <TopBar/>
      <div className="container p-6 space-y-6">
        <div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-start space-x-2">
                <DiveSettingsPopover />
                <h2 className="text-2xl">
                  Plan
                </h2>
              </div>
              <DivePlanTable/>
            </div>
            <div>
              <h2 className="text-2xl">
                Gases
              </h2>
              <GasTable/>
            </div>
          </div>
        </div>
        <h2 className="text-2xl">
          Decompression profile
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <DecompressionTable/>
          <DiveProfileChart className="col-span-2"/>
        </div>
        <Collapsible>
          <div className="flex items-center justify-start mb-6 space-x-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon">
                <ChevronsUpDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <h2 className="text-2xl">
              Compartment gas load
            </h2>
          </div>
          <CollapsibleContent>
            <div className="grid grid-cols-4 gap-y-4">
              {Array.from({ length: 16 }).map((_, id ) => (
                <CompartmentGasLoadChart
                  key={String(id)}
                  id={String(id + 1)}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </main>
  )
}
