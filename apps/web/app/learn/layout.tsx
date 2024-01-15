import * as React from "react";
import {PropsWithChildren} from "react";
import {Sidebar} from "@/app/learn/components/sidebar";

export default function DocsLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex container gap-8">
      <Sidebar className="w-[300px] hidden xl:block"/>
      <article className="py-10 prose prose-xl prose-neutral">
        {children}
      </article>
    </div>
  )
}
