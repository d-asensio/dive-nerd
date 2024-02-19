import * as React from "react"

import {RebreatherChecklistDisclaimerAlert} from "./components/rebreather-checklist-disclaimer-alert";
import {ChecklistForm} from "./components/checklist-form";

export default function SharkChecklist() {
  return (
    <div className="container p-0">
      <div className="max-w-3xl m-auto">
        <div className="p-6">
          <RebreatherChecklistDisclaimerAlert/>
        </div>
        <ChecklistForm/>
      </div>
    </div>
  )
}
