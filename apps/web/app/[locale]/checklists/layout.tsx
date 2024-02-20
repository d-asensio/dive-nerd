"use client"

import type {PropsWithChildren} from "react";
import type {PropsWithPageParams} from "@/app/types";
import * as React from "react";

import {I18nProviderClient} from "@/locales/client";

type LayoutProps = PropsWithChildren<PropsWithPageParams>

export default function ChecklistsLayout({ children, params: { locale } }: LayoutProps) {
  return (
    <I18nProviderClient locale={locale}>
      {children}
    </I18nProviderClient>
  )
}
