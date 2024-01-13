import * as React from "react";

import {ShareButton} from "@/components/app/share-button";
import {LanguageSelector} from "@/components/app/language-selector";
import {Separator} from "@/components/ui/separator";
import {MainNav} from "@/components/app/main-nav";

export const TopBar = () => (
  <div className="h-full flex-col flex">
    <div
      className="container flex items-center justify-between space-y-2 space-x-8 py-4 sm:space-y-0 md:h-16">
      <div className="flex items-center space-x-2">
        <span className="text-4xl">
          🤿
        </span>
        <h2 className="text-2xl font-semibold">
          DiveNerd
        </h2>
      </div>
      <MainNav/>
      <div className="hidden md:flex ml-auto w-full space-x-2 sm:justify-end">
        <div className="hidden space-x-2 md:flex">
          <ShareButton/>
          <LanguageSelector/>
        </div>
      </div>
    </div>
    <Separator/>
  </div>
)
