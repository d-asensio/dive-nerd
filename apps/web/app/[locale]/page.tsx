import * as React from "react";

import {DiveProfileChart} from "@/components/app/dive-profile-chart";
import {DivePlanTable} from "@/components/app/dive-plan-table";
import {GasTable} from "@/components/app/gas-table";
import {DecompressionTable} from "@/components/app/decompression-table";
import {DiveSettings} from "@/components/app/dive-settings";
import {Tabs, TabsContent, TabsList, TabsTrigger,} from "@/components/ui/tabs"
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
          <Tabs defaultValue="profile">
            <TabsList className="grid grid-cols-2 max-w-md">
              <TabsTrigger value="profile">{t('planner.tabs.profile')}</TabsTrigger>
              <TabsTrigger value="compartments">{t('planner.tabs.compartments')}</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <div className="grid w-full gap-4">
                <DiveProfileChart/>
                <IndividualCompartmentCharts/>
              </div>
            </TabsContent>
            <TabsContent value="compartments">
              <div className="grid w-full">
                <CompartmentsProfileChart/>
              </div>
            </TabsContent>
          </Tabs>
          <div className='grid gap-4 lg:grid-cols-2 xl:grid-cols-3'>
            <div className="xl:col-span-2 min-w-0 space-y-4">
              <Card className="overflow-x-auto">
                <CardHeader>
                  <CardTitle>{t('planner.tabs.levels')}</CardTitle>
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
              <Card>
                <CardHeader>
                  <CardTitle>{t('planner.tabs.config')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <DiveSettings/>
                </CardContent>
              </Card>
            </div>
            <Card className="overflow-x-auto">
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
