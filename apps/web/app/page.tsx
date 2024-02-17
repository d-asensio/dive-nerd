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

export default function Home() {
  return (
    <main>
      <div className="container p-6 space-y-4">
        <DivePlannerDisclaimerAlert />
        <div className="gap-6 flex flex-col-reverse lg:flex-col">
          <Tabs defaultValue="profile">
            <TabsList className="grid grid-cols-3 max-w-xl">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="compartments">Compartments</TabsTrigger>
              <TabsTrigger value="individual-compartments">Individual
                compartments</TabsTrigger>
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
                <TabsTrigger value="levels">Levels</TabsTrigger>
                <TabsTrigger value="gases">Gases</TabsTrigger>
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
                <CardTitle>Decompression Profile</CardTitle>
                <CardDescription>25 minutes</CardDescription>
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
