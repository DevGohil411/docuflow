"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const loginUrl = "/login"
  const { data: user, isLoading, invalidate } = useCurrentUser()
  const BACKEND_URL = useMemo(() => process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000", [])

  const initials = (user?.name || "").split(" ").map((n) => n[0]).filter(Boolean).slice(0, 2).join("").toUpperCase()

  const onLogout = async () => {
    try {
      await fetch(`${BACKEND_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      })
    } catch (e) {
      // ignore
    } finally {
      await invalidate()
      router.push("/")
      router.refresh()
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-xl font-bold text-[#2563eb]">DocuFlow</span>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 ml-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </Button>
        </div>

        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-semibold leading-6 transition-colors hover:text-[#2563eb]",
                pathname === item.href ? "text-[#2563eb]" : "text-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-4">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={user.profilePic} alt={user.name} />
                    <AvatarFallback>{initials || "U"}</AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/app/dashboard")}>Dashboard</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/app/profile")}>Profile</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={onLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" asChild>
                <a href={loginUrl}>Sign in</a>
              </Button>
              <Button asChild className="bg-[#2563eb] hover:bg-[#1d4ed8]">
                <a href={loginUrl}>Sign up</a>
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border transition-transform duration-300 ease-in-out",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
            <span className="text-xl font-bold text-[#2563eb]">DocuFlow</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="-m-2.5 rounded-md p-2.5"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="sr-only">Close menu</span>
            <X className="h-6 w-6" aria-hidden="true" />
          </Button>
        </div>
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-border">
            <div className="space-y-2 py-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors hover:bg-muted",
                    pathname === item.href ? "text-[#2563eb]" : "text-foreground",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="py-6">
              {user ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.profilePic} alt={user.name} />
                      <AvatarFallback>{initials || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[10rem]">{user.email}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => { router.push("/app/dashboard"); setMobileMenuOpen(false) }}>Dashboard</Button>
                    <Button variant="destructive" onClick={() => { setMobileMenuOpen(false); onLogout() }}>Logout</Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    asChild
                    className="w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <a href={loginUrl}>Sign in</a>
                  </Button>
                  <Button
                    asChild
                    className="w-full bg-[#2563eb] hover:bg-[#1d4ed8]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <a href={loginUrl}>Sign up</a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}
    </header>
  )
}
