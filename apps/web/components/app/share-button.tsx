import * as React from "react"

import { CopyIcon } from "lucide-react"

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover";

export function ShareButton() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Share</Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[520px]">
        <div className="flex flex-col space-y-2 text-center sm:text-left">
          <h3 className="text-lg font-semibold">
            Share dive plan
          </h3>
          <p className="text-sm text-muted-foreground">
            Anyone who has this link will be able to view this dive profile.
          </p>
        </div>
        <div className="flex items-center space-x-2 pt-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue="https://divenerd.app/p/7bbKYQvsVkNmVb8NGcdUOLae"
              readOnly
              className="h-9"
            />
          </div>
          <Button type="submit" size="sm" className="px-3">
            <span className="sr-only">
              Copy
            </span>
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}