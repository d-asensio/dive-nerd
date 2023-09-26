import * as React from "react";

import {cn} from "@/lib/utils";

import {Separator} from "@/components/ui/separator";
import {Input, InputProps} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import {ShareButton} from "@/components/app/share-button";
import {DiveProfileChart} from "@/components/app/dive-profile-chart";
import {Badge} from "@/components/ui/badge";

const TopBar = () => (
  <div className="hidden h-full flex-col md:flex">
    <div
      className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
      <div className="flex items-center space-x-2">
        <span className="text-4xl">
          🤿
        </span>
        <h2 className="text-2xl font-semibold">
          DiveNerd
        </h2>
      </div>
      <div className="ml-auto flex w-full space-x-2 sm:justify-end">
        <div className="hidden space-x-2 md:flex">
          <ShareButton/>
        </div>
      </div>
    </div>
    <Separator/>
  </div>
)

interface InputWithUnitsProps extends Omit<InputProps, "decorator"> {
  units: string
}

const InputWithUnits = ({units, ...props}: InputWithUnitsProps) => (
  <Input
    decorator={
      <>
        <Separator orientation={"vertical"}/>
        <span
          className={cn(
            "flex p-2 items-center w-auto border-l-0 rounded-l-none text-muted-foreground select-none whitespace-nowrap"
          )}
        >
          {units}
        </span>
      </>
    }
    {...props}
  />
)

export function DivePlanTable(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Table {...props}>
      <TableHeader>
        <TableRow>
          <TableHead>
            Depth
          </TableHead>
          <TableHead>
            Duration
          </TableHead>
          <TableHead className="w-[300px]">
            Gas
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>
            <InputWithUnits
              size="sm"
              units='m'
              type="number"
              defaultValue="30"
            />
          </TableCell>
          <TableCell>
            <InputWithUnits
              size="sm"
              units='min.'
              type="number"
              defaultValue="30"
            />
          </TableCell>
          <TableCell>
            <div className='flex items-center space-x-2'>
              <InputWithUnits
                size="sm"
                units='% O2'
                type="number"
                defaultValue="30"
              />
              <span>/</span>
              <InputWithUnits
                size="sm"
                units='% He'
                type="number"
                defaultValue="30"
              />
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export function DecompressionTable(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              Depth
            </TableHead>
            <TableHead>
              Duration
            </TableHead>
            <TableHead>
              Gas
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">
              45 m
            </TableCell>
            <TableCell>
              25 min.
            </TableCell>
            <TableCell>
              <Badge className="bg-indigo-400 hover:bg-indigo-400/80 select-none whitespace-nowrap">
                Tx 21/22
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">
              21 m
            </TableCell>
            <TableCell>
              1 min.
            </TableCell>
            <TableCell>
              <Badge className="bg-orange-400 hover:bg-orange-400/80 select-none whitespace-nowrap">
                EAN 50
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">
              18 m
            </TableCell>
            <TableCell>
              1 min.
            </TableCell>
            <TableCell>
              <Badge className="bg-orange-400 hover:bg-orange-400/80 select-none whitespace-nowrap">
                EAN 50
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">
              15 m
            </TableCell>
            <TableCell>
              1 min.
            </TableCell>
            <TableCell>
              <Badge className="bg-orange-400 hover:bg-orange-400/80 select-none whitespace-nowrap">
                EAN 50
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">
              12 m
            </TableCell>
            <TableCell>
              1 min.
            </TableCell>
            <TableCell>
              <Badge className="bg-orange-400 hover:bg-orange-400/80 select-none whitespace-nowrap">
                EAN 50
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">
              9 m
            </TableCell>
            <TableCell>
              1 min.
            </TableCell>
            <TableCell>
              <Badge className="bg-orange-400 hover:bg-orange-400/80 select-none whitespace-nowrap">
                EAN 50
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">
              6 m
            </TableCell>
            <TableCell>
              1 min.
            </TableCell>
            <TableCell>
              <Badge className="bg-green-400 hover:bg-green-400/80 select-none whitespace-nowrap">
                O2 100%
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">
              3 m
            </TableCell>
            <TableCell>
              1 min.
            </TableCell>
            <TableCell>
              <Badge className="bg-green-400 hover:bg-green-400/80 select-none whitespace-nowrap">
                O2 100%
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">
              0 m
            </TableCell>
            <TableCell>
              -
            </TableCell>
            <TableCell>
              -
            </TableCell>
          </TableRow>

        </TableBody>
      </Table>
    </div>
  )
}


export default function Home() {
  return (
    <main>
      <TopBar/>
      <div className="container p-6 space-y-6">
        <div>
          <h2 className="text-xl">
            Dive plan
          </h2>
          <DivePlanTable/>
          <Separator />
        </div>
        <h2 className="text-xl">
          Decompression profile
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <DecompressionTable/>
          <DiveProfileChart className="col-span-2"/>
        </div>
      </div>
    </main>
  )
}
