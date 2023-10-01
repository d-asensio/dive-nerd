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


export default function Home() {
  return (
    <main>
      <TopBar/>
      <div className="container p-6 space-y-6">
        <div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl">
                  Plan
                </h2>
                <DiveSettingsPopover />
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
        <h2 className="text-2xl">
          Compartments
        </h2>
        <div className="grid grid-cols-4 gap-y-4">
          {Array.from({ length: 16 }).map((_, id ) => (
            <CompartmentGasLoadChart
              key={String(id)}
              id={String(id + 1)}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
