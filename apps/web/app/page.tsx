import * as React from "react";

import {
  alveolarInertGasPartialPressure,
  alveolarWaterVaporPressure,
  buhlmannCompartments,
  fromDepthToHydrostaticPressure,
  getSurfaceSaturatedCompartmentInertGasLoads, inertGasTimeConstant,
  inspiredGasChangeRate,
  schreinerEquation
} from "dive-physics"

import {DiveProfileChart} from "@/components/app/dive-profile-chart";
import {TopBar} from "@/components/app/top-bar";
import {DivePlanTable} from "@/components/app/dive-plan-table";
import {GasTable} from "@/components/app/gas-table";
import {DecompressionTable} from "@/components/app/decompression-table";
import {DiveSettings} from "@/components/app/dive-settings";
import {
  CompartmentGasLoadChart
} from "@/components/app/compartment-gas-load-chart";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {ChevronsUpDown, Settings} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
  calculatesIntervalsFromPlan,
  DiveProfileInterval
} from "dive-profile-generator";
import {pipe} from "ramda";


/**
 * Dive variables
 */
const surfaceAmbientPressure = 1.0133 // bar
const waterDensity = 1023.6 // kg/m3
const waterVaporPressure = alveolarWaterVaporPressure({
  respiratoryQuotient: 0.9,
  carbonDioxidePressure: 0.0533,
  waterPressure: 0.0627
})

const intervals = calculatesIntervalsFromPlan({
  configuration: {
    descentRate: 10,
    ascentRate: 9
  },
  levels: [
    {
      depth: 45,
      duration: 30,
      gasMix: {fO2: .21, fHe: 0}
    },
    {
      depth: 21,
      duration: 2,
      gasMix: {fO2: .21, fHe: 0}
    },
    {
      depth: 18,
      duration: 2,
      gasMix: {fO2: .21, fHe: 0}
    },
    {
      depth: 15,
      duration: 4,
      gasMix: {fO2: .21, fHe: 0}
    },
    {
      depth: 12,
      duration: 5,
      gasMix: {fO2: .21, fHe: 0}
    },
    {
      depth: 9,
      duration: 8,
      gasMix: {fO2: .21, fHe: 0}
    },
    {
      depth: 6,
      duration: 68,
      gasMix: {fO2: .21, fHe: 0}
    },
    {
      depth: 0,
      duration: 0,
      gasMix: {fO2: .21, fHe: 0}
    }
  ]
})


  .reduce((acc: DiveProfileInterval[], interval) => {
    const sampleEvery = 0.5 // seconds to minutes
    const intervalTime = interval.endTime - interval.startTime
    const totalIntervals = Math.round(intervalTime / sampleEvery)

    const timeDelta = intervalTime / totalIntervals
    const depthDelta = (interval.endDepth - interval.startDepth) / totalIntervals

    return [
      ...acc,
      ...Array.from({length: totalIntervals}).map((_, i) => ({
        type: interval.type,
        startTime: interval.startTime + (timeDelta * i),
        endTime: interval.startTime + (timeDelta * (i + 1)),
        startDepth: interval.startDepth + (depthDelta * i),
        endDepth: interval.startDepth + (depthDelta * (i + 1)),
        gasMix: interval.gasMix
      }))
    ]
  }, [])


interface DiveProfileIntervalWithAmbientPressure extends DiveProfileInterval {
  startAmbientPressure: number
  endAmbientPressure: number
}

interface DiveProfileIntervalWithDescentRate extends DiveProfileIntervalWithAmbientPressure {
  descentRate: number
}

interface DiveProfileIntervalWithAlveolarInertGasPressures extends DiveProfileIntervalWithDescentRate {
  startAlveolarInertGasPressures: {
    N2: number
    He: number
  }
}

const calculateAmbientPressure: (interval: DiveProfileInterval) => DiveProfileIntervalWithAmbientPressure =
  interval => ({
    ...interval,
    startAmbientPressure: fromDepthToHydrostaticPressure({
      depth: interval.startDepth,
      surfaceAmbientPressure,
      waterDensity
    }),
    endAmbientPressure: fromDepthToHydrostaticPressure({
      depth: interval.endDepth,
      surfaceAmbientPressure,
      waterDensity
    }),
  })


const calculateDescentRate: (interval: DiveProfileIntervalWithAmbientPressure) => DiveProfileIntervalWithDescentRate =
  interval => ({
    ...interval,
    descentRate: (interval.endAmbientPressure - interval.startAmbientPressure) / (interval.endTime - interval.startTime)
  })


const calculateAlveolarInertGasPressures: (interval: DiveProfileIntervalWithDescentRate) => DiveProfileIntervalWithAlveolarInertGasPressures =
  interval => ({
    ...interval,
    startAlveolarInertGasPressures: {
      N2: alveolarInertGasPartialPressure({
        ambientPressure: interval.startAmbientPressure,
        waterVaporPressure,
        inertGasFraction: 0.79
      }),
      He: alveolarInertGasPartialPressure({
        ambientPressure: interval.startAmbientPressure,
        waterVaporPressure,
        inertGasFraction: 0
      })
    }
  })

const calculateInterval: (interval: DiveProfileInterval) => DiveProfileIntervalWithAlveolarInertGasPressures =
  pipe(
    calculateAmbientPressure,
    calculateDescentRate,
    calculateAlveolarInertGasPressures
  )


const calculatedIntervals = intervals.map(calculateInterval)


const surfaceSaturatedCompartmentInertGasLoads = getSurfaceSaturatedCompartmentInertGasLoads({
  surfaceAmbientPressure,
  waterVaporPressure
})

const dive = calculatedIntervals.reduce(({cumulativeCompartmentInertGasLoad, dataPoints}, interval) => {
  const intervalTime = interval.endTime - interval.startTime

  const nextCumulativeCompartmentInertGasLoad = cumulativeCompartmentInertGasLoad.map((compartmentInertGasLoads, compartmentId) => ({
    N2: schreinerEquation({
      initialAlveolarGasPartialPressure: interval.startAlveolarInertGasPressures.N2,
      initialCompartmentGasPartialPressure: compartmentInertGasLoads.N2,
      gasChangeRate: inspiredGasChangeRate({
        descentRate: interval.descentRate,
        inertGasFraction: 0.79
      }),
      gasTimeConstant: inertGasTimeConstant({
        inertGasHalfTime: buhlmannCompartments[compartmentId].N2.halfTime
      }),
      intervalTime
    }),
    He: schreinerEquation({
      initialAlveolarGasPartialPressure: interval.startAlveolarInertGasPressures.He,
      initialCompartmentGasPartialPressure: compartmentInertGasLoads.He,
      gasChangeRate: inspiredGasChangeRate({
        descentRate: interval.descentRate,
        inertGasFraction: 0
      }),
      gasTimeConstant: inertGasTimeConstant({
        inertGasHalfTime: buhlmannCompartments[compartmentId].He.halfTime
      }),
      intervalTime
    }),
  }))

  return {
    cumulativeCompartmentInertGasLoad: nextCumulativeCompartmentInertGasLoad,
    dataPoints: [
      ...dataPoints,
      {
        compartmentInertGasLoads: nextCumulativeCompartmentInertGasLoad,
        ambientPressure: interval.endAmbientPressure,
        x: interval.endTime,
        y: interval.endDepth
      }
    ]
  }
}, {
  cumulativeCompartmentInertGasLoad: surfaceSaturatedCompartmentInertGasLoads,
  dataPoints: [
    {
      compartmentInertGasLoads: surfaceSaturatedCompartmentInertGasLoads,
      ambientPressure: surfaceAmbientPressure,
      x: 0,
      y: 0
    }
  ]
})

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
              <DiveProfileChart dataPoints={dive.dataPoints}/>
            </div>
          </TabsContent>
          <TabsContent value="compartments">

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
        {false && (
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
                    dive={dive}
                    surfaceAmbientPressure={surfaceAmbientPressure}
                  />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </main>
  )
}
