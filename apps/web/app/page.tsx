import * as React from "react";
import {AlertTriangle, ArrowDown, ArrowRight, ArrowUp, Plus} from "lucide-react"

import {cn} from "@/lib/utils";

import {Separator} from "@/components/ui/separator";
import {Input, InputProps} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import {ShareButton} from "@/components/app/share-button";
import {DiveProfileChart} from "@/components/app/dive-profile-chart";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

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
          <TableHead className="w-[200px]">
            Gas
          </TableHead>
          <TableHead className="w-0"/>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="bg-red-100 hover:bg-red-100/50">
          <TableCell>
            <InputWithUnits
              units='m'
              type="number"
              defaultValue="45"
            />
          </TableCell>
          <TableCell>
            <InputWithUnits
              units='min.'
              type="number"
              defaultValue="25"
            />
          </TableCell>
          <TableCell>
            <Select defaultValue='nitrox-50'>
              <SelectTrigger>
                <SelectValue placeholder="-- no gas selected --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="helitrox-21/22">
                  <Badge className="bg-indigo-400 hover:bg-indigo-400/80 select-none whitespace-nowrap">
                    Helitrox 21/22
                  </Badge>
                </SelectItem>
                <SelectItem value="nitrox-50">
                  <Badge className="bg-orange-400 hover:bg-orange-400/80 select-none whitespace-nowrap">
                    Nitrox 50
                  </Badge>
                </SelectItem>
                <SelectItem value="oxygen-100">
                  <Badge className="bg-green-400 hover:bg-green-400/80 select-none whitespace-nowrap">
                    Oxygen 100
                  </Badge>
                </SelectItem>
              </SelectContent>
            </Select>
          </TableCell>
          <TableCell>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-[300px] text-red-500">
                  The maximum operating depth for the selected gas
                  is <span className='font-bold'>21 meters</span>.
                </p>
              </TooltipContent>
            </Tooltip>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export function GasTable(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Table {...props}>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]" >
            Gas
          </TableHead>
          <TableHead className="w-0" />
          <TableHead className='text-right'>
            MOD
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>
            <div className='flex items-center space-x-2'>
              <InputWithUnits
                units='% O2'
                type="number"
                defaultValue="21"
              />
              <span>/</span>
              <InputWithUnits
                units='% He'
                type="number"
                defaultValue="22"
              />
            </div>
          </TableCell>
          <TableCell>
            <Badge className="bg-indigo-400 hover:bg-indigo-400/80 select-none whitespace-nowrap">
              Helitrox 21/22
            </Badge>
          </TableCell>
          <TableCell className='text-right'>
            57 m
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <div className='flex items-center space-x-2'>
              <InputWithUnits
                units='% O2'
                type="number"
                defaultValue="50"
              />
              <span>/</span>
              <InputWithUnits
                units='% He'
                type="number"
                defaultValue="0"
              />
            </div>
          </TableCell>
          <TableCell>
            <Badge className="bg-orange-400 hover:bg-orange-400/80 select-none whitespace-nowrap">
              Nitrox 50
            </Badge>
          </TableCell>
          <TableCell className='text-right'>
            21 m
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <div className='flex items-center space-x-2'>
              <InputWithUnits
                units='% O2'
                type="number"
                defaultValue="100"
              />
              <span>/</span>
              <InputWithUnits
                units='% He'
                type="number"
                defaultValue="0"
              />
            </div>
          </TableCell>
          <TableCell>
            <Badge className="bg-green-400 hover:bg-green-400/80 select-none whitespace-nowrap">
              Oxygen 100
            </Badge>
          </TableCell>
          <TableCell className='text-right'>
            6 m
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={3} className="text-right">
            <Button variant="ghost">
              <Plus className="mr-2 h-4 w-4" />
              Add gas mix
            </Button>
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
            <TableHead className="w-0" />
            <TableHead>
              Depth
            </TableHead>
            <TableHead>
              Duration
            </TableHead>
            <TableHead className="text-right">
              Gas
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <ArrowDown className="text-blue-500"/>
            </TableCell>
            <TableCell className="font-medium">
              45 m
            </TableCell>
            <TableCell>
              5 min.
            </TableCell>
            <TableCell className="text-right">
              <Badge className="bg-indigo-400 hover:bg-indigo-400/80 select-none whitespace-nowrap">
                Helitrox 21/22
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <ArrowRight className="text-gray-500"/>
            </TableCell>
            <TableCell className="font-medium">
              45 m
            </TableCell>
            <TableCell>
              25 min.
            </TableCell>
            <TableCell className="text-right">
              <Badge className="bg-indigo-400 hover:bg-indigo-400/80 select-none whitespace-nowrap">
                Helitrox 21/22
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow className="font-medium bg-muted/50">
            <TableCell colSpan={3}>
              Deco stops from 21 m
            </TableCell>
            <TableCell className="text-right">
              7 min.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <ArrowUp className="text-red-500"/>
            </TableCell>
            <TableCell className="font-medium">
              21 m
            </TableCell>
            <TableCell>
              1 min.
            </TableCell>
            <TableCell className="text-right">
              <Badge className="bg-orange-400 hover:bg-orange-400/80 select-none whitespace-nowrap">
                Nitrox 50
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <ArrowUp className="text-red-500"/>
            </TableCell>
            <TableCell className="font-medium">
              18 m
            </TableCell>
            <TableCell>
              1 min.
            </TableCell>
            <TableCell className="text-right">
              <Badge className="bg-orange-400 hover:bg-orange-400/80 select-none whitespace-nowrap">
                Nitrox 50
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <ArrowUp className="text-red-500"/>
            </TableCell>
            <TableCell className="font-medium">
              15 m
            </TableCell>
            <TableCell>
              1 min.
            </TableCell>
            <TableCell className="text-right">
              <Badge className="bg-orange-400 hover:bg-orange-400/80 select-none whitespace-nowrap">
                Nitrox 50
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <ArrowUp className="text-red-500"/>
            </TableCell>
            <TableCell className="font-medium">
              12 m
            </TableCell>
            <TableCell>
              1 min.
            </TableCell>
            <TableCell className="text-right">
              <Badge className="bg-orange-400 hover:bg-orange-400/80 select-none whitespace-nowrap">
                Nitrox 50
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <ArrowUp className="text-red-500"/>
            </TableCell>
            <TableCell className="font-medium">
              9 m
            </TableCell>
            <TableCell>
              3 min.
            </TableCell>
            <TableCell className="text-right">
              <Badge className="bg-orange-400 hover:bg-orange-400/80 select-none whitespace-nowrap">
                Nitrox 50
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow className="font-medium bg-muted/50">
            <TableCell colSpan={3}>
              Deco stops from 6 m
            </TableCell>
            <TableCell className="text-right">
              9 min.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <ArrowUp className="text-red-500"/>
            </TableCell>
            <TableCell className="font-medium">
              6 m
            </TableCell>
            <TableCell>
              3 min.
            </TableCell>
            <TableCell className="text-right">
              <Badge className="bg-green-400 hover:bg-green-400/80 select-none whitespace-nowrap">
                Oxygen 100
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <ArrowUp className="text-red-500"/>
            </TableCell>
            <TableCell className="font-medium">
              3 m
            </TableCell>
            <TableCell>
              6 min.
            </TableCell>
            <TableCell className="text-right">
              <Badge className="bg-green-400 hover:bg-green-400/80 select-none whitespace-nowrap">
                Oxygen 100
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <ArrowUp className="text-red-500"/>
            </TableCell>
            <TableCell className="font-medium">
              0 m
            </TableCell>
            <TableCell>
              -
            </TableCell>
            <TableCell className="text-right">
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-2xl">
                Plan
              </h2>
              <DivePlanTable/>
            </div>
            <div>
              <h2 className="text-2xl">
                Gas
              </h2>
              <GasTable />
            </div>
          </div>
        </div>
        <h2 className="text-2xl">
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
