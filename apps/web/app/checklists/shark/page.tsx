import * as React from "react"

import {RebreatherChecklistDisclaimerAlert} from "./components/rebreather-checklist-disclaimer-alert";
import {ChecklistForm} from "./components/checklist-form";

export default function SharkChecklist() {
  return (
    <div className="container p-6">
      <div className="max-w-3xl space-y-6 m-auto">
        <RebreatherChecklistDisclaimerAlert/>
        <ChecklistForm/>
      </div>
    </div>
  )
}
