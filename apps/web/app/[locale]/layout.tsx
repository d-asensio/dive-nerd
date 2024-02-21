import '../globals.css'
import type {Metadata, Viewport} from 'next'
import type {PropsWithPageParams} from "@/app/types";
import * as React from "react";
import {PropsWithChildren} from "react";
import {Inter} from 'next/font/google'
import {UserProvider} from "@auth0/nextjs-auth0/client";

import {TooltipProvider} from "@/components/ui/tooltip";
import {TopBar} from "@/components/app/top-bar";
import {Toaster} from "@/components/ui/toaster";
import {Footer} from "@/components/app/footer";

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

type LayoutProps = PropsWithChildren<PropsWithPageParams>

export default async function RootLayout({ children, params: { locale } }: LayoutProps) {
  return (
    <html lang={locale}>
    <UserProvider>
      <body className={inter.className}>
      <TooltipProvider>
        <TopBar/>
        {children}
        <Footer/>
      </TooltipProvider>
      <Toaster/>
      </body>
    </UserProvider>
    </html>
  )
}
