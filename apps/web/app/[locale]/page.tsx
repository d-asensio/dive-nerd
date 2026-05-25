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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {Settings} from "lucide-react";
import {
  CompartmentsProfileChart
} from "@/components/app/compartments-profile-chart";
import {
  IndividualCompartmentCharts
} from "@/components/app/individual-compartment-charts";
import {
  DivePlannerDisclaimerAlert
} from "@/components/app/dive-planner-disclaimer-alert";
import {DecompressionSummary} from "@/components/app/decompression-summary";
import {DiveMetricsCards} from "@/components/app/dive-metrics-cards";
import {getI18n} from "@/locales/server";

export default async function Home() {
  const t = await getI18n()
  return (
    <main>
      <div className="container p-6 space-y-4">
        <DivePlannerDisclaimerAlert />
        <div className="gap-6 flex flex-col-reverse lg:flex-col">
          <DiveMetricsCards/>
          <Tabs defaultValue="profile">
            <TabsList className="grid grid-cols-3 max-w-xl">
              <TabsTrigger value="profile">{t('planner.tabs.profile')}</TabsTrigger>
              <TabsTrigger value="compartments">{t('planner.tabs.compartments')}</TabsTrigger>
              <TabsTrigger value="individual-compartments">{t('planner.tabs.individual_compartments')}</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <div className="grid w-full">
                <DiveProfileChart/>
              </div>
            </TabsContent>
            <TabsContent value="compartments">
              <div className="grid w-full">
                <CompartmentsProfileChart/>
              </div>
            </TabsContent>
            <TabsContent value="individual-compartments">
              <IndividualCompartmentCharts/>
            </TabsContent>
          </Tabs>
          <div className='grid lg:grid-cols-2 xl:grid-cols-3'>
            <Tabs defaultValue="levels" className="xl:col-span-2 min-w-0">
              <TabsList className="grid grid-cols-3 max-w-lg mr-16 mb-4">
                <TabsTrigger value="levels">{t('planner.tabs.levels')}</TabsTrigger>
                <TabsTrigger value="gases">{t('planner.tabs.gases')}</TabsTrigger>
                <TabsTrigger value="config">
                  <Settings className="w-4 h-4"/>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="levels">
                <DivePlanTable/>
              </TabsContent>
              <TabsContent value="gases">
                <GasTable/>
              </TabsContent>
              <TabsContent value="config">
                <DiveSettings/>
              </TabsContent>
            </Tabs>
            <Card className="overflow-x-auto">
              <CardHeader>
                <CardTitle>{t('planner.decompression.title')}</CardTitle>
                <CardDescription>
                  <DecompressionSummary/>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DecompressionTable/>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
