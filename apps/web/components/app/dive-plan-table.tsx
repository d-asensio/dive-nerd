import * as React from "react";
import {AlertTriangle} from "lucide-react";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Badge} from "@/components/ui/badge";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

import {InputWithUnits} from "@/components/app/input-with-units";

export const DivePlanTable = (props: React.HTMLAttributes<HTMLDivElement>) => {
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
                <SelectValue placeholder="-- no gas selected --"/>
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
                <AlertTriangle className="h-4 w-4 text-red-500"/>
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