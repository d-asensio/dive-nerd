import type {PropsWithPageParams} from "@/app/types";
import * as React from "react";

import { MDXRemote } from 'next-mdx-remote/rsc';
import { getDocBySlug } from '@/services/get-doc-by-slug';

import {MinGasTable} from "@/components/app/min-gas-table";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {Loader2} from "lucide-react";

const components = {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  MinGasTable
}


export default async function DocsLayout({ params: { locale, postId } }: PropsWithPageParams<{ postId: string }>) {
  console.log(postId)
  const source = getDocBySlug(postId, locale)

  if (!source) {
    return (
      <>Not found</>
    )
  }

  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center w-full">
          <Loader2 className="mt-28 h-8 w-8 animate-spin"/>
        </div>
      }>
      <MDXRemote source={source} components={components}/>
    </React.Suspense>
  )
}

