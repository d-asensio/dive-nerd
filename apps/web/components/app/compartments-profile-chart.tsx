"use client"

import {ResponsiveLine} from '@nivo/line'

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useSelector} from "@/state/useSelector";
import {diveIntervalsSelector} from "@/state/dive-plan/selectors";
import {calculateDiveProfile, surfaceAmbientPressure} from "@/utils/calculate-dive-profile";
import {useI18n} from "@/locales/client";

export function CompartmentsProfileChart() {
  const t = useI18n()
  const showCompartments = useSelector(state => state.showCompartments)
  const diveIntervals = useSelector(diveIntervalsSelector)
  const gfLow = useSelector(state => state.gradientFactorLow)
  const gfHigh = useSelector(state => state.gradientFactorHigh)

  if (!showCompartments) return null

  const intervals = calculateDiveProfile(diveIntervals, {
    gfLow,
    gfHigh,
    firstStopAmbientPressure: surfaceAmbientPressure, // placeholder — chart ignores ceiling
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('planner.tabs.compartments')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="min-w-0 overflow-x-auto">
          <div className="min-w-[600px] h-[450px]">
            <ResponsiveLine
              enablePoints={false}
              data={[
                {
                  id: "Dive Profile",
                  data: intervals
                },
                ...Array.from({ length: 16 }).map((_, i) => ({
                  id: `Compartment ${i}`,
                  data: intervals.map(({compartmentInertGasLoads, x, }) => ({
                    x,
                    y: compartmentInertGasLoads[i].N2 + compartmentInertGasLoads[i].He
                  }))
                }))
              ]}
              margin={{top: 12, right: 18, bottom: 62, left: 62}}
              xScale={{type: "linear"}}
              yScale={{
                type: "linear",
                min: "auto",
                max: "auto",
                stacked: false,
                reverse: true
              }}
              yFormat=" >-.2f"
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: t('planner.chart.axis.time_minutes'),
                legendOffset: 40,
                legendPosition: "start"
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: t('planner.chart.axis.pressure_bars'),
                legendOffset: -40,
                legendPosition: "start"
              }}
              pointSize={5}
              pointBorderWidth={1}
              pointBorderColor={{from: "serieColor"}}
              pointLabelYOffset={-12}
              useMesh
              tooltip={() => null}
              enableCrosshair={false}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
