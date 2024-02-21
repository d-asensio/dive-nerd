import {Separator} from "@/components/ui/separator";
import {LanguageSelector} from "@/components/app/language-selector";
import * as React from "react";

export function Footer() {
  return (
    <>
      <Separator/>
      <div className="p-8 flex justify-end w-full">
        <LanguageSelector/>
      </div>
    </>
  );
}
