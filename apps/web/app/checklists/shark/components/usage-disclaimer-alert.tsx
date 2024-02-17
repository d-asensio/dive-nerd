import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertTriangle} from "lucide-react";
import * as React from "react";

export function UsageDisclaimerAlert() {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4"/>
      <AlertTitle>IMPORTANT NOTICE</AlertTitle>
      <AlertDescription>
        This rebreather diving checklist is a general guide, not a comprehensive resource or training program. Diving includes inherent risks. Each diver uses our information at their own risk and is personally responsible for understanding and managing these risks. This site is not liable for any accidents, injuries, or fatalities that may occur. Seek certified professional training before diving.
      </AlertDescription>
    </Alert>
  )
}
