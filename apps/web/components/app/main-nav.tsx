import * as React from "react";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";

export const MainNav = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/"
        className="text-sm whitespace-nowrap font-medium transition-colors hover:text-primary"
      >
        Planner
      </Link>
      <Link
        href="/learn/gas-planning-guide"
        className="text-sm whitespace-nowrap font-medium transition-colors hover:text-primary"
      >
        Learn
      </Link>
    </nav>
  )
}
