import * as React from "react";

import {buhlmannCompartments} from "dive-physics"

import {DiveProfileChart} from "@/components/app/dive-profile-chart";
import {TopBar} from "@/components/app/top-bar";
import {DivePlanTable} from "@/components/app/dive-plan-table";
import {GasTable} from "@/components/app/gas-table";
import {DecompressionTable} from "@/components/app/decompression-table";
import {DiveSettings} from "@/components/app/dive-settings";
import {CompartmentGasLoadChart} from "@/components/app/compartment-gas-load-chart";

import {Collapsible, CollapsibleContent, CollapsibleTrigger,} from "@/components/ui/collapsible"
import {Tabs, TabsContent, TabsList, TabsTrigger,} from "@/components/ui/tabs"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {ChevronsUpDown, Settings} from "lucide-react";
import {Button} from "@/components/ui/button";
import {CompartmentsProfileChart} from "@/components/app/compartments-profile-chart";

export default function Home() {
  return (
    <main>
      <TopBar/>
      <div className="container p-6 gap-6 flex flex-col-reverse lg:flex-col">
        <Tabs defaultValue="profile">
          <TabsList className="grid grid-cols-2 max-w-md">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="compartments">Compartments</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <div className="grid w-full">
              <DiveProfileChart />
            </div>
          </TabsContent>
          <TabsContent value="compartments">
            <div className="grid w-full">
              <CompartmentsProfileChart />
            </div>
          </TabsContent>
        </Tabs>
        <div className='grid lg:grid-cols-2 xl:grid-cols-3'>
          <Tabs defaultValue="levels" className="xl:col-span-2 min-w-0">
            <TabsList className="grid grid-cols-3 max-w-lg mr-16 mb-4">
              <TabsTrigger value="levels">Levels</TabsTrigger>
              <TabsTrigger value="gases">Gases</TabsTrigger>
              <TabsTrigger value="config">
                <Settings className="w-4 h-4" />
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
        <Collapsible>
          <div className="flex items-center justify-start mb-6 space-x-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon">
                <ChevronsUpDown className="h-4 w-4"/>
              </Button>
            </CollapsibleTrigger>
            <h2 className="text-2xl">
              Compartment gas load
            </h2>
          </div>
          <CollapsibleContent>
            <div className="grid grid-cols-1 gap-y-4">
              {buhlmannCompartments.map((_, id) => (
                <CompartmentGasLoadChart
                  key={id}
                  compartmentId={id}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </main>
  )
}
