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
    name: '10',
    volume: 10
  },
  {
    name: '12',
    volume: 12
  },
  {
    name: '15',
    volume: 15
  },
  {
    name: '18',
    volume: 18
  },
  {
    name: '2x10',
    volume: 20
  },
  {
    name: '2x12',
    volume: 24
  },
  {
    name: '2x15',
    volume: 30
  },
  {
    name: '2x18',
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
            {cylinders.map(({name}) => (
              <TableHead key={name}>{name}l</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {depthLevels.map(depth => (
            <TableRow key={depth}>
              <TableCell>{depth}m</TableCell>
              {cylinders.map(({volume}) => (
                <TableCell key={volume} >
                  {minGas({
                    depth0: depth,
                    depth1: 0,
                    sacRate,
                    volume
                  })}bar
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
