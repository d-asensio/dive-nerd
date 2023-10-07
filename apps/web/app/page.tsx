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
      duration: 30
    },
    {
      depth: 21,
      duration: 2
    },
    {
      depth: 18,
      duration: 2
    },
    {
      depth: 15,
      duration: 4
    },
    {
      depth: 12,
      duration: 5
    },
    {
      depth: 9,
      duration: 8
    },
    {
      depth: 6,
      duration: 68
    },
    {
      depth: 0,
      duration: 0
    }
  ]
})


.reduce((acc: DiveProfileInterval[], interval)  => {
  const sampleEvery = 0.5 // seconds to minutes
  const intervalTime = interval.endTime - interval.startTime
  const totalIntervals = Math.round(intervalTime/sampleEvery)

  const timeDelta = intervalTime/totalIntervals
  const depthDelta = (interval.endDepth - interval.startDepth) / totalIntervals

  return [
    ...acc,
    ...Array.from({ length: totalIntervals }).map((_, i) => ({
      type: interval.type,
      startTime: interval.startTime + (timeDelta * i),
      endTime: interval.startTime + (timeDelta * (i+1)),
      startDepth: interval.startDepth + (depthDelta * i),
      endDepth: interval.startDepth + (depthDelta * (i+1)),
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
    descentRate: (interval.endAmbientPressure - interval.startAmbientPressure)/(interval.endTime - interval.startTime)
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

const dive = calculatedIntervals.reduce(({ cumulativeCompartmentInertGasLoad, dataPoints }, interval) => {
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
          <DiveProfileChart
            dataPoints={dive.dataPoints}
            className="col-span-2"
          />
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
      </div>
    </main>
  )
}
