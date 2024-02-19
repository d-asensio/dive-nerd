import * as React from "react";
import {PropsWithChildren} from "react";
import {Sidebar} from "./components/sidebar";

export default function DocsLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex container gap-8">
      <Sidebar className="w-[300px] hidden xl:block"/>
      <article className="py-10 prose prose-xl prose-neutral w-full">
        {children}
      </article>
    </div>
  )
}
