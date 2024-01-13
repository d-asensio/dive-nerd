"use client"

import * as React from "react"

import {buhlmannCompartments} from "dive-physics"
import {CompartmentGasLoadChart} from "@/components/app/compartment-gas-load-chart"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

export function IndividualCompartmentCharts() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <div className="w-full p-8">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {buhlmannCompartments.map((_, id) => (
            <CarouselItem key={id} className="basis-full lg:basis-1/2">
              <CompartmentGasLoadChart compartmentId={id} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        Compartment {current} of {count}
      </div>
    </div>
  )
}
