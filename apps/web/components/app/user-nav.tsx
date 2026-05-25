import {getSession} from "@auth0/nextjs-auth0";

import {
  Avatar,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Button, buttonVariants} from "@/components/ui/button"
import {LanguageSelector} from "@/components/app/language-selector";
import {getI18n} from "@/locales/server";

/**
 * Returns the current Auth0 session, or `null` if Auth0 isn't configured
 * (typically in local dev without `.env.local`). The SDK throws synchronously
 * with `"secret" is required` when env vars are missing — we swallow that
 * specific case so the planner still renders without auth credentials.
 */
async function safeGetSession() {
  try {
    return await getSession()
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Auth0 session unavailable, rendering logged-out state:', (error as Error).message)
    }
    return null
  }
}

export async function UserNav() {
  const session = await safeGetSession()
  const t = await getI18n()

  if (!session?.user) {
    return (
      <a
        href="/api/auth/login"
        className={buttonVariants({ variant: "ghost" })}
      >
        {t('nav.login')}
      </a>
    )
  }

  const { user } = session

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.picture} alt={user.name} />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/api/auth/logout">
            {t('nav.logout')}
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
