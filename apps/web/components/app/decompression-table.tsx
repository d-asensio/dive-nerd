import * as React from "react";
import {ArrowDown, ArrowRight, ArrowUp} from "lucide-react";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";

export const DecompressionTable = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...props}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0"/>
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