import * as React from "react";
import {AlertTriangle} from "lucide-react";

import {getScopedI18n} from "@/locales/server";

import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";

export async function RebreatherChecklistDisclaimerAlert() {
  const t = await getScopedI18n('rebreather_checklists.disclaimer')

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4"/>
      <AlertTitle>{t('title')}</AlertTitle>
      <AlertDescription>
        {t('description')}
      </AlertDescription>
    </Alert>
  )
}
