import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import {TooltipProvider} from "@/components/ui/tooltip";
import {TopBar} from "@/components/app/top-bar";
import * as React from "react";
import {Toaster} from "@/components/ui/toaster";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DiveNerd',
  description: 'Your savvy dive buddy',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TooltipProvider>
          <TopBar/>
          {children}
        </TooltipProvider>
        <Toaster />
      </body>
    </html>
  )
}
