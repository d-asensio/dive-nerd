"use client"

import * as React from "react";
import {cn} from "@/lib/utils";
import Link from "next/link";

import {useI18n} from "@/locales/client";

export const MainNav = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
  const t = useI18n()

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/"
        className="text-sm whitespace-nowrap font-medium transition-colors hover:text-primary"
      >
        {t('nav.planner')}
      </Link>
      <Link
        href="/learn/gas-planning-guide"
        className="text-sm whitespace-nowrap font-medium transition-colors hover:text-primary"
      >
        {t('nav.learn')}
      </Link>
    </nav>
  )
}
