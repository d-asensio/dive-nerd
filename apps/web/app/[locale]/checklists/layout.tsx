import type {PropsWithChildren} from "react";

// The I18nProviderClient is mounted once at `app/[locale]/layout.tsx` so it
// covers every localized route, including this one. This layout is kept as
// a thin passthrough in case checklist-specific wrappers are needed later.
export default function ChecklistsLayout({ children }: PropsWithChildren) {
  return <>{children}</>
}
