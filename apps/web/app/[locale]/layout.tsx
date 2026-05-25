import '../globals.css'
import type {Metadata, Viewport} from 'next'
import type {PropsWithPageParams} from "@/app/types";
import * as React from "react";
import {PropsWithChildren} from "react";
import {Inter} from 'next/font/google'
import {NuqsAdapter} from 'nuqs/adapters/next/app'

import {TooltipProvider} from "@/components/ui/tooltip";
import {TopBar} from "@/components/app/top-bar";
import {Toaster} from "@/components/ui/toaster";
import {Footer} from "@/components/app/footer";
import {I18nProviderClient} from "@/locales/client";

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

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale } = await params
  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NuqsAdapter>
          <I18nProviderClient locale={locale}>
            <TooltipProvider>
              <TopBar/>
              {children}
              <Footer/>
            </TooltipProvider>
            <Toaster/>
          </I18nProviderClient>
        </NuqsAdapter>
      </body>
    </html>
  )
}
