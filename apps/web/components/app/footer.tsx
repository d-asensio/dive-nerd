import {Separator} from "@/components/ui/separator";
import {LanguageSelector} from "@/components/app/language-selector";
import * as React from "react";

export function Footer() {
  return (
    <div>
      <Separator/>
      <div className="container p-8">
        <div className="flex justify-end">
          <LanguageSelector/>
        </div>
      </div>
    </div>
  );
}
