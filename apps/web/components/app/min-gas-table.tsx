import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function petecrackFormula ({ depth0, depth1 = 0, sacRate }: { depth0: number, depth1?: number, sacRate: number }) {
  if(depth0 < depth1) return 0

  const P0 = depth0/10 + 1
  const P1 = depth1/10 + 1
  const alphaDepth = depth0 - depth1

  const Pavg = (P0 + P1)/2

  const tts = Math.ceil(alphaDepth/3) + 1

  return Pavg * tts * sacRate * 2
}

function roundToNearestFive(n: number) {
  return Math.round(n / 5) * 5;
}

function minGas({ depth0, depth1 = 0, sacRate, volume }: { depth0: number, depth1?: number, sacRate: number, volume: number }) {
  const liters = petecrackFormula({
    depth0,
    depth1,
    sacRate
  })

  return roundToNearestFive(liters / volume)
}

const depthLevels = [10, 20, 30, 40, 50, 60, 70]
const sacRate = 20
const cylinders = [
  {
    name: '10l single',
    volume: 10
  },
  {
    name: '12l single',
    volume: 12
  },
  {
    name: '15l single',
    volume: 15
  },
  {
    name: '18l single',
    volume: 18
  },
  {
    name: '10l twin set',
    volume: 20
  },
  {
    name: '12l twin set',
    volume: 24
  },
  {
    name: '15l twin set',
    volume: 30
  },
  {
    name: '18l twin set',
    volume: 36
  }
]

export function MinGasTable() {
  return (
    <div className='space-y-6'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            {depthLevels.map(depth => (
              <TableHead key={depth} className="whitespace-nowrap">
                {depth}m ({(depth/10) + 1} atm)
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {cylinders.map(({name, volume}) => (
            <TableRow key={name}>
              <TableCell className="font-medium whitespace-nowrap">
                {name}
              </TableCell>
              {depthLevels.map(depth => (
                <TableCell key={volume} >
                  {minGas({
                    depth0: depth,
                    depth1: 0,
                    sacRate,
                    volume
                  })} bar
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
