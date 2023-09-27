import * as React from "react";
import {Minus, Plus} from "lucide-react";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";

import {InputWithUnits} from "@/components/app/input-with-units";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

export const GasTable = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <Table {...props}>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">
            Gas
          </TableHead>
          <TableHead className="w-0"/>
          <TableHead className='text-right'>
            MOD
          </TableHead>
          <TableHead className="w-0"/>
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
          <TableCell>
            <Tooltip>
              <TooltipTrigger>
                <Button size="icon" variant="outline" disabled>
                  <Minus className="h-4 w-4"/>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                First gas cannot be removed
              </TooltipContent>
            </Tooltip>
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
          <TableCell>
            <Tooltip>
              <TooltipTrigger>
                <Button size="icon" variant="outline">
                  <Minus className="h-4 w-4"/>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Remove gas
              </TooltipContent>
            </Tooltip>
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
          <TableCell>
            <Tooltip>
              <TooltipTrigger>
                <Button size="icon" variant="outline">
                  <Minus className="h-4 w-4"/>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Remove gas
              </TooltipContent>
            </Tooltip>
          </TableCell>
        </TableRow>
        <TableRow className="hover:bg-background">
          <TableCell colSpan={4} className="text-right">
            <Button variant="ghost">
              <Plus className="mr-2 h-4 w-4"/>
              Add gas mix
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}