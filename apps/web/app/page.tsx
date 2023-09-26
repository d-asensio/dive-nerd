import * as React from "react";

import {cn} from "@/lib/utils";

import {Separator} from "@/components/ui/separator";
import {Input, InputProps} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"

import {ShareButton} from "@/components/app/share-button";
import {DiveProfileChart} from "@/components/app/dive-profile-chart";

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

export function ProfileTable() {
  return (
    <Table>
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
          <TableCell className="font-medium">
            <InputWithUnits
              size="sm"
              units='meters'
              type="number"
              defaultValue="30"
            />
          </TableCell>
          <TableCell>
            <InputWithUnits
              size="sm"
              units='minutes'
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


export default function Home() {
  return (
    <main>
      <TopBar/>
      <div className="container p-6">
        <ProfileTable/>
        <DiveProfileChart/>
      </div>
    </main>
  )
}
