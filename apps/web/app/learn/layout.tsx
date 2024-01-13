import * as React from "react";
import {PropsWithChildren} from "react";

export default function DocsLayout({ children }: PropsWithChildren) {
  return (
    <article className="container py-10 prose prose-xl prose-neutral">
      {children}
    </article>
  )
}
