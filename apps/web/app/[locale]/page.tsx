import * as React from "react";

import {DiveProfileChart} from "@/components/app/dive-profile-chart";
import {ChartLegend} from "@/components/app/chart-legend";
import {ChartViewPopover} from "@/components/app/chart-view-popover";
import {DivePlanTable} from "@/components/app/dive-plan-table";
import {GasTable} from "@/components/app/gas-table";
import {TankTable} from "@/components/app/tank-table";
import {DecompressionTable} from "@/components/app/decompression-table";
import {DiveSettingsPopover} from "@/components/app/dive-settings-popover";
import {GasManagementSettingsPopover} from "@/components/app/gas-management-settings-popover";
import {AlgorithmSettings} from "@/components/app/algorithm-settings";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  CompartmentsProfileChart
} from "@/components/app/compartments-profile-chart";
import {
  IndividualCompartmentCharts
} from "@/components/app/individual-compartment-charts";
import {
  DivePlannerDisclaimerAlert
} from "@/components/app/dive-planner-disclaimer-alert";
import {DiveMetrics} from "@/components/app/dive-metrics";
import {getI18n} from "@/locales/server";

export default async function Home() {
  const t = await getI18n()
  return (
    <main>
      <div className="container p-6 space-y-4">
        <DivePlannerDisclaimerAlert />
        <div className="gap-6 flex flex-col-reverse lg:flex-col">
          <Card>
            <CardHeader className="flex flex-row items-center justify-end space-y-0 p-3 pb-0">
              <ChartViewPopover/>
            </CardHeader>
            <CardContent className="space-y-6 p-4 pt-2">
              <div className="space-y-3">
                <ChartLegend/>
                <div className="grid w-full">
                  <DiveProfileChart/>
                </div>
              </div>
              <CompartmentsProfileChart/>
              <IndividualCompartmentCharts/>
            </CardContent>
          </Card>
          <div className='grid gap-4 lg:grid-cols-2 xl:grid-cols-5'>
            <div className="xl:col-span-3 min-w-0 space-y-4">
              <Card className="overflow-x-auto">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle>{t('planner.tabs.dive')}</CardTitle>
                  <DiveSettingsPopover/>
                </CardHeader>
                <CardContent className="p-0">
                  <DivePlanTable/>
                </CardContent>
              </Card>
              <Card className="overflow-x-auto">
                <CardHeader>
                  <CardTitle>{t('planner.tabs.gases')}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <GasTable/>
                </CardContent>
              </Card>
              <Card className="overflow-x-auto">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle>{t('planner.tabs.tanks')}</CardTitle>
                  <GasManagementSettingsPopover/>
                </CardHeader>
                <CardContent className="p-0">
                  <TankTable/>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{t('planner.tabs.algorithm')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <AlgorithmSettings/>
                </CardContent>
              </Card>
            </div>
            <Card className="overflow-x-auto xl:col-span-2">
              <CardHeader>
                <CardTitle>{t('planner.decompression.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <DiveMetrics/>
                <DecompressionTable/>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
