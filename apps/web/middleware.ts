import { createI18nMiddleware } from "next-international/middleware";
import type { NextRequest } from "next/server";

import { auth0 } from "@/lib/auth0";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "es", "ca", "de", "fr", "it", "pl"],
  defaultLocale: "en",
});

export async function middleware(request: NextRequest) {
  const authResponse = await auth0.middleware(request);

  if (request.nextUrl.pathname.startsWith("/auth")) {
    return authResponse;
  }

  return I18nMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|.*\\..*).*)"],
};
