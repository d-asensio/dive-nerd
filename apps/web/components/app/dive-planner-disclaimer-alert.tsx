import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertTriangle} from "lucide-react";
import * as React from "react";
import {getScopedI18n} from "@/locales/server";

export async function DivePlannerDisclaimerAlert() {
  const t = await getScopedI18n('planner.disclaimer')

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
